// src/app/login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoginOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import "./LoginPage.css";
import {
  Form,
  Button,
  Input,
  ConfigProvider,
  FormProps,
  Spin,
  Modal,
} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";
import { loginUser } from "@/lib/actions";
import { getCountryFromIP } from "@/lib/actions";
import posthog from "posthog-js";

type FieldType = {
  memberPhone?: number;
  memberPassword?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [smsErrorMessage, setSmsErrorMessage] = useState<string>("");
  const [successModalVisible, setSuccessModalVisible] =
    useState<boolean>(false);
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [defaultCountry, setDefaultCountry] = useState("tw");
  const [dialCode, setDialCode] = useState<string>("852");

  useEffect(() => {
    getCountryFromIP()
      .then((countryCode) => setDefaultCountry(countryCode))
      .catch(() => setDefaultCountry("tw"));
  }, []);

  useEffect(() => {
    // checkLogin();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  const checkLogin = async () => {
    const token = localStorage.getItem(
      `${process.env.NEXT_PUBLIC_TENANT_HOST}_authToken`,
    );
    if (!token) {
      setLoading(false);
      return;
    }

    // Token validation would be handled by the API client in protected routes
    setLoading(false);
  };

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (
    values: any,
  ) => {
    try {
      const trimmedNumber = values.memberPhone?.startsWith(dialCode)
        ? values.memberPhone.slice(dialCode.length)
        : values.memberPhone;

      const result = await loginUser({
        member_phone: trimmedNumber,
        member_password: values.memberPassword,
        dial_code: dialCode,
      });

      if (result.success) {
        // Identify user and track successful login
        posthog.identify(trimmedNumber, {
          phone: trimmedNumber,
          phone_country_code: dialCode,
        });

        posthog.capture("login_success", {
          phone: trimmedNumber,
          phone_country_code: dialCode,
        });

        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        posthog.captureException(new Error("Login failed"), {
          error: result.error,
          phone: trimmedNumber,
          phone_country_code: dialCode,
        });

        setSmsErrorMessage(result.error || "登入失敗，請再試一次");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      posthog.captureException(error, {
        phone: values.memberPhone,
        phone_country_code: dialCode,
      });
      setSmsErrorMessage("伺服器錯誤，請稍後再試");
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: "#FFF1D0" } }}>
        <Image
          src="/Login-background.png"
          alt="Background"
          width={0}
          height={0}
          sizes="100vh"
          id="backdrop-image"
        />
        <div className="login-container">
          <div className="logo-section">
            <div className="logo-wrapper">
              <Image
                src="/black-sg-studio-logo.png"
                alt="MM9 Creative Co. Logo"
                width={24}
                height={24}
                sizes="100vh"
                id="logo-image"
              />
            </div>
          </div>
          <div className="form-container">
            <Form
              form={form}
              onFinish={handleSubmit}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="login-form"
            >
              <Form.Item className="form-title">
                <span>登入帳戶</span>
              </Form.Item>
              <Form.Item<FieldType> name="memberPhone" label={false}>
                <PhoneInput
                  country={defaultCountry}
                  value={memberPhone}
                  onChange={(value, country: any) => {
                    setMemberPhone(`+${value}`);
                    setDialCode(country.dialCode);
                  }}
                  enableAreaCodes
                  enableSearch
                  // inputClass="input-field"
                  inputStyle={{ width: "100%", height: "50px" }}
                  placeholder="電話號碼"
                />
              </Form.Item>
              <Form.Item<FieldType> name="memberPassword">
                <Input.Password
                  placeholder="密碼"
                  type={showPassword ? "text" : "password"}
                  className="input-field-password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item className="login-button-container" label={null}>
                <Button
                  color="default"
                  variant="solid"
                  htmlType="submit"
                  id="login-btn"
                >
                  登入
                  <LoginOutlined id="login-svg" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div id="create-account">
          <Button type="link" onClick={handleSignup} id="signup-button">
            建立帳戶
          </Button>
        </div>

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <SmileOutlined style={{ fontSize: "36px" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                登入成功 !
              </p>
              <p style={{ fontSize: "10px", color: "#595959", margin: 0 }}>
                正在導向至控制台... &nbsp;
              </p>
            </div>
          </div>
        </Modal>

        {smsErrorMessage && (
          <Modal
            centered
            open={true}
            footer={null}
            closable={false}
            maskClosable={true}
            onCancel={() => setSmsErrorMessage("")}
            style={{ padding: "12px", textAlign: "center" }}
            width={300}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <FrownOutlined style={{ fontSize: "36px" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
                  請再試一次
                </p>
                <p style={{ fontSize: 10, color: "#595959", margin: 0 }}>
                  {smsErrorMessage}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </ConfigProvider>
    </>
  );
};

export default LoginPage;
