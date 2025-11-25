// src/app/signup/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, DatePicker, Modal, Tabs } from "antd";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Image from "next/image";
import "./signup_page.css";
import { ArrowLeftOutlined, LoginOutlined, SmileOutlined, FrownOutlined } from "@ant-design/icons";
import posthog from 'posthog-js';
import { getCountryFromIP, checkReferrer, signupUser, verifyOTP } from "@/lib/actions";

const SignupPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();
    const searchParams = useSearchParams();
    const { TabPane } = Tabs;

    const [referrerMode, setReferrerMode] = useState<"phone" | "code">("phone");
    const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [memberPhone, setMemberPhone] = useState<string>("");
    const [smsErrorMessage, setSmsErrorMessage] = useState<string>("");
    const [showOtpContent, setShowOtpContent] = useState(false);
    const [customOtpModalVisible, setCustomOtpModalVisible] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const [dialCode, setDialCode] = useState("852");
    const [referralDialCode, setReferralDialCode] = useState("852");
    const [defaultCountry, setDefaultCountry] = useState("hk");
    const [signupPayload, setSignupPayload] = useState(null);

    const [feedbackModal, setFeedbackModal] = useState<{
        visible: boolean;
        icon: React.ReactNode;
        title: string;
        message: string;
    }>({
        visible: false,
        icon: null,
        title: '',
        message: ''
    });

    const showFeedbackModal = (icon: React.ReactNode, title: string, message: string) => {
        setFeedbackModal({ visible: true, icon, title, message });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            getCountryFromIP()
                .then((countryCode) => setDefaultCountry(countryCode))
                .catch(() => setDefaultCountry("hk"));
        }
    }, []);

    useEffect(() => {
        if (customOtpModalVisible) {
            setTimeout(() => setShowOtpContent(true), 350);
        } else {
            setShowOtpContent(false);
        }
    }, [customOtpModalVisible]);

    useEffect(() => {
        const referralCode = searchParams.get('ref');
        if (referralCode) {
            form.setFieldsValue({ referrer_phone: referralCode });
        }
    }, [form, searchParams]);

    useEffect(() => {
        if(timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const checkReferrerExists = async (input: string, mode: "phone" | "code"): Promise<boolean> => {
        if (!input) return true; // skip check if empty (optional field)
        try {
            const trimmedNumber = mode === "phone" && input.startsWith(referralDialCode)
                ? input.slice(referralDialCode.length)
                : input;

            const result = await checkReferrer(trimmedNumber, mode, referralDialCode);
            return result.exists;
        } catch (err) {
            console.error("Referrer check failed", err);
            posthog.captureException(err, { mode, input });
            return false;
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const trimmedNumber = values.member_phone.startsWith(dialCode) ? values.member_phone.slice(dialCode.length) : values.member_phone;

            const payload: any = {
                member_name: values.member_name,
                member_birthday: values.member_birthday.format("YYYY-MM-DD"),
                member_phone: trimmedNumber,
                member_password: values.member_password,
                dial_code: `+${dialCode}`,
                tenant_host: process.env.NEXT_PUBLIC_TENANT_HOST,
                membi_customer_secret: process.env.NEXT_PUBLIC_MEMBI_CUSTOMER_SECRET,
            };

            if (referrerMode === "phone" && values.referrer_input) {
                const exists = await checkReferrerExists(values.referrer_input, "phone");
                if (!exists) {
                    throw new Error("推薦人電話號碼不存在");
                }
                const trimmedReferrerNumber = values.referrer_input.startsWith(referralDialCode) ? values.referrer_input.slice(referralDialCode.length) : values.referrer_input;
                payload.referrer_phone = trimmedReferrerNumber;
                payload.referrer_dial_code = referralDialCode;
            } else if (referrerMode === "code" && values.member_referral_code) {
                const exists = await checkReferrerExists(values.member_referral_code, "code");
                if (!exists) {
                    throw new Error("推薦碼不存在");
                }
                payload.referrer_referral_code = values.member_referral_code;
            }

            setSignupPayload(payload);

            const data = await signupUser(payload);
            if (data.success && data.sms_result.success) {
                setCustomOtpModalVisible(true);
                setTimeLeft(120);
            } else {
                posthog.captureException(new Error("[Signup] SMS Sending Failed"), data)
                showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "SMS 發送失敗", data.sms_result?.message || data.error || "請稍後再試");
            }
        } catch (error: any) {
            console.error("Signup error:", error);
            posthog.captureException(error, values);
            showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "錯誤", error.message || "無法註冊，請稍後再試。");
        } finally {
            setLoading(false);
        }
    };

    const onHandleVerifyOTPCode = async () => {
        if (!verificationCode) {
            showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "請輸入驗證碼", "請先填寫 6 位驗證碼");
            return;
        }

        const trimmedNumber = memberPhone.startsWith(`+${dialCode}`) ? memberPhone.slice(dialCode.length + 1) : memberPhone;
        setLoading(true);
        try {
            const data = await verifyOTP({
                verificationCode: verificationCode,
                member_phone: trimmedNumber,
                dial_code: `+${dialCode}`
            });

            if (data.status !== "fail") {
                posthog.capture('signup_completed', {
                    phone_country_code: dialCode,
                    phone_number: trimmedNumber,
                    referral_mode: referrerMode,
                });

                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                    router.push("/login");
                }, 3000);
            } else {
                console.error('Signup Error [OTP Verification]:', data);
                posthog.captureException(new Error('[Signup] OTP Verification Failed'), {
                    data,
                    phone_country_code: dialCode,
                    phone_number: trimmedNumber,
                });
                showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "驗證失敗", data.message || "驗證碼錯誤或已失效");
            }
        } catch (error) {
            console.error("Signup Error [OTP Verification]:", error);
            posthog.captureException(error, {
                phone_country_code: dialCode,
                phone_number: trimmedNumber,
            });
            showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "錯誤", "無法驗證您的身份，請稍後再嘗試");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key: string) => {
        setReferrerMode(key as "phone" | "code");
        form.setFieldsValue({ referrer_input: undefined, member_referral_code: undefined });
    };

    const handleBackBtnClick = () => {
        setCustomOtpModalVisible(false);
        setFeedbackModal({ visible: false, icon: <></>, title: "", message: "" });
        setSignupPayload(null)
    };

    const handleLogin = () => {
        router.push("/login");
    };

    const handleResendOTP = async () => {
        try{
            const data = await signupUser(signupPayload as any);
            if (data.success && data.sms_result.success) {
                posthog.capture('otp_resend_success', {
                    phone_country_code: dialCode,
                });
                showFeedbackModal(<SmileOutlined style={{ fontSize: 36 }} />, "已重新發送驗證碼", "請查看您的手機");
                setTimeLeft(120);
            } else {
                console.error("Signup Error [SMS Resend]:", data);
                posthog.captureException(new Error('[Signup] OTP Resend Failed'), {
                    data,
                    signupPayload,
                });
                showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "SMS 發送失敗", data.sms_result?.message || data.error || "請稍後再試");
            }
        }catch(error: any){
            console.error("Signup Error [SMS Resend]:", error);
            posthog.captureException(error, {
              signupPayload,
            });
            showFeedbackModal(<FrownOutlined style={{ fontSize: 36 }} />, "錯誤", error.message || "無法註冊，請稍後再試。");
        }
    }

    return (
        <>
            <Image src={"/Login-background.png"} alt="" width={0} height={0} sizes="100vh" id="signup-page-bg" />
            <div id="login-container">
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <div id="signup-form-title">
                        建立帳戶
                        <Image src={"/white-sg-studio-logo.png"} alt="Membi Logo" width={0} height={0} sizes="100vh" id="membi-logo" />
                    </div>
                    <Form.Item
                        name="member_name"
                        label="名稱"
                        rules={[{ required: true, message: "請輸入名稱" }]}
                        className="form-item"
                    >
                        <Input placeholder="請輸入名稱" className="form-item-input" />
                    </Form.Item>
                    <Form.Item
                        name="member_birthday"
                        label="生日"
                        rules={[{ required: true, message: "請選擇生日" }]}
                        className="form-item"
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} placeholder="請選擇生日" className="form-item-input" />
                    </Form.Item>
                    <Form.Item
                        name="member_phone"
                        label="電話號碼"
                        rules={[
                            { required: true, message: "請輸入電話號碼" },
                        ]}
                        className="form-item"
                    >
                        <PhoneInput
                            country={defaultCountry}
                            value={memberPhone}
                            onChange={(value, country: any) => {
                                setMemberPhone(`+${value}`);
                                setDialCode(country.dialCode);
                            }}
                            inputStyle={{ width: '100%', height: '45px' }}
                            enableAreaCodes
                            enableSearch
                            placeholder="電話號碼"
                        />
                    </Form.Item>
                    {smsErrorMessage !== "" ? <span>{smsErrorMessage}</span> : <></>}
                    <Form.Item
                        name="member_password"
                        label="密碼"
                        rules={[{ required: true, message: "請輸入密碼" }]}
                        hasFeedback
                        className="form-item"
                    >
                        <Input.Password placeholder="請輸入密碼" className="form-item-input" />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="確認密碼"
                        dependencies={["member_password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "請確認密碼" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("member_password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("兩次輸入的密碼不一致"));
                                },
                            }),
                        ]}
                        className="form-item"
                    >
                        <Input.Password placeholder="請再次輸入密碼" className="form-item-input" />
                    </Form.Item>
                    <Form.Item label="推薦人資料" className="form-item">
                        <Tabs
                            defaultActiveKey="phone"
                            onChange={handleTabChange}
                            className="signup-tabs"
                            moreIcon={null}
                            renderTabBar={(props, DefaultTabBar) => (
                                <DefaultTabBar {...props} className="signup-tabs-bar" />
                            )}
                        >
                            <TabPane
                                key="phone"
                                tab={<div className={`signup-tabs-tab ${referrerMode === 'phone' ? 'signup-tabs-tab-active' : ''}`}>電話號碼</div>}
                            >
                                <Form.Item name="referrer_input">
                                    <PhoneInput
                                        country={defaultCountry}
                                        inputStyle={{ width: "100%", height: "48px" }}
                                        enableSearch
                                        onChange={(value, country: any) => {
                                            setReferralDialCode(`+${country.dialCode}`);
                                            form.setFieldsValue({ referrer_input: `+${value}` })
                                        }}
                                    />
                                </Form.Item>
                            </TabPane>
                            <TabPane
                                key="code"
                                tab={<div className={`signup-tabs-tab ${referrerMode === 'code' ? 'signup-tabs-tab-active' : ''}`}>推薦碼</div>}
                            >
                                <Form.Item name="member_referral_code" style={{ width: '100%' }}>
                                    <Input placeholder="請輸入推薦碼（可選）" className="form-item-input" />
                                </Form.Item>
                            </TabPane>
                        </Tabs>
                    </Form.Item>
                    <Form.Item className="signup-form-submit" style={{ marginTop: "-16px", marginBottom: "20px" }}>
                        <Button type="primary" htmlType="submit" loading={loading} id="signup-submit-btn">
                            確定<LoginOutlined id="login-svg-link" style={{ height: "20px", width: "20px" }} />
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div id="login-account">
                <Button type="link" onClick={handleLogin} id="login-button">
                    登入帳戶
                </Button>
            </div>

            <Modal
                open={customOtpModalVisible}
                footer={null}
                closable={false}
                maskClosable={false}
                centered
                className="otp-fullscreen-modal"
                style={{ padding: 0 }}
            >
                <div className={`otp-modal-content ${showOtpContent ? "visible" : ""}`}>
                    <div id="signup-back">
                        <Button type="link" variant="link" onClick={() => handleBackBtnClick()} id="back-btn">
                            <span style={{ fontSize: "24px", marginRight: "4px" }}>
                                <ArrowLeftOutlined />
                            </span> 返回
                        </Button>
                    </div>
                    <div style={{ maxWidth: 400, marginBottom: '60px', textAlign: 'center' }}>
                        <Image width={160} height={200} src="/verify-icon.png" alt="verify graphic" style={{ marginBottom: 16 }} priority />
                        <h2>已成功記錄會員資料</h2>
                        <p style={{ color: '#666' }}>我們已將驗證碼發送至您的手機，請完成電話驗證</p>
                        <div style={{ fontWeight: 600, fontSize: 16, marginTop: 30, color: 'var(--army-green60)' }}>電話號碼</div>
                        <div style={{ margin: '10px 0', fontWeight: 600, fontSize: 16, padding: 10, border: '3px solid var(--army-green60)', borderRadius: 10, color: '#666' }}>{`${memberPhone}`}</div>
                        <div style={{ fontWeight: 600, fontSize: 16, marginTop: 30, color: 'var(--army-green)' }}>請輸入驗證碼</div>
                        <Input placeholder="- - - - - -" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} style={{ margin: '12px 0', textAlign: 'center', fontSize: 24, fontWeight: 700, letterSpacing: 12, border: '3px solid var(--army-green)', borderRadius: 10, color: 'var(--army-green)' }} />
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--army-green)' }}>驗證碼流程有效 &nbsp; {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
                        {timeLeft === 0 && (
                            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--army-green)', marginTop: 8 }}>
                                沒有收到驗證碼？
                                <Button type="link" style={{ padding: 0, fontSize: 11 }} onClick={handleResendOTP}>
                                    重新發送
                                </Button>
                            </div>
                        )}
                        <Button type="primary" block style={{ marginTop: 40, background: '#495e4f', height: 60, fontWeight: 700, fontSize: 24 }} onClick={onHandleVerifyOTPCode} loading={loading}>
                            提交驗證碼
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                centered
                open={successModalVisible}
                footer={null}
                closable={false}
                maskClosable={true}
                onCancel={() => setSuccessModalVisible(false)}
                style={{ padding: "12px", textAlign: "center" }}
                width={250}
            >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px" }}>
                    <SmileOutlined style={{ fontSize: "36px" }} />
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>註冊成功 !</p>
                        <p style={{ fontSize: "10px", color: "#595959", margin: 0 }}>正在重新導向至登入頁面... &nbsp;</p>
                    </div>
                </div>
            </Modal>

            <Modal
                centered
                open={feedbackModal.visible}
                footer={null}
                closable={false}
                maskClosable={true}
                onCancel={() => setFeedbackModal(prev => ({ ...prev, visible: false }))}
                style={{ padding: "12px", textAlign: "center" }}
                width={300}
            >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", zIndex: "999" }}>
                    {feedbackModal.icon}
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 15, fontWeight: "bold", margin: 0 }}>{feedbackModal.message}</p>
                        <p style={{ fontSize: 12, color: "#595959", margin: 0 }}>{feedbackModal.title}</p>
                    </div>
                </div>
            </Modal>

        </>
    );
};

export default SignupPage;
