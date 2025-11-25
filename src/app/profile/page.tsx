// src/app/dashboard/profile/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Input, Button, Row, Col, message, Modal, Form, DatePicker, Avatar } from "antd";
import { useRouter } from "next/navigation";
import { SmileOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./profile_page.css";
import Image from "next/image";
import { getMemberProfileDetail, updateMemberProfile } from "@/lib/actions";

const ProfilePage: React.FC = () => {
  const [cardData, setCardData] = useState<any>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  useEffect(() => {
    // Fetch member's info
    const fetchProfileDetailData = async () => {
      try {
        const data = await getMemberProfileDetail();
        setCardData(data);
        // Set the form fields with the fetched data
        form.setFieldsValue({
          member_name: data.member_name,
          birthday: data.birthday ? dayjs(data.birthday) : null,
        });
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };
    fetchProfileDetailData();
    console.log(dayjs().daysInMonth());
  }, [form]);

  const onFinish = async (values: any) => {
    const {
      member_name,
      birthday,
      current_password,
      new_password,
      confirm_password,
    } = values;

    if (new_password && new_password !== confirm_password) {
      message.error("New password and confirm password do not match.");
      return;
    }

    try {
      const result = await updateMemberProfile({
        member_name: member_name,
        birthday: birthday ? birthday.format("YYYY-MM-DD") : null,
        current_password: current_password || undefined,
        new_password: new_password || undefined,
      });

      if (result.success) {
        // message.success("儲存成功！");
        setSuccessModalVisible(true);
        setTimeout(() => setSuccessModalVisible(false), 3000);

        form.resetFields([
          "current_password",
          "new_password",
          "confirm_password",
        ]);
      } else {
        message.error(
          `Error updating profile: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred while updating the profile.");
    }
  };

  const closeProfile = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div id="close-profile-container">
        <Button type="link" variant="link" onClick={closeProfile} id="back-btn">
           <span style={{ fontSize: "24px", marginRight: "4px" }}>
             <ArrowLeftOutlined />
           </span> 返回
         </Button>
      </div>

      <div className="page-container">
        <div className="profile-sec">
          <div className="avatar-wrapper">
            <Image
              src="/white-sg-studio-black-bg-logo.png"
              alt="logo"
              width={75}
              height={75}
              style={{
                objectFit: 'contain',
                paddingBottom: '8px',
              }}
              className="profile-img-change"
            />
          </div>
          <div className="member-info">
            <span className="card-name">
              {cardData?.member_name}
            </span>
            <Row className="member-info-row">
              <Col span={8}>
                <span className="member-info-one">
                  {cardData?.points_balance ?? "-"}
                </span>
                <br/>
                <span className="member-info-two">
                  可使用積分
                </span>
              </Col>
              <Col span={8} className="member-info-center-col">
                <Image
                  src={`/dashboard/lvl${cardData?.membership_tier_sequence ?? 1}.png`}
                  alt={`Level ${cardData?.membership_tier_sequence ?? 1}`}
                  width={40}
                  height={40}
                />
                <br/>
                <span className="member-info-two">
                  {cardData?.membership_tier_name ?? "會員等級"}
                </span>
              </Col>
              <Col span={8}>
                <span className="member-info-one">
                  {cardData?.total_order ?? "-"}
                </span>
                <br/>
                <span className="member-info-two">
                  訂單總數
                </span>
              </Col>
            </Row>
            <Row>
              <div className="profile-info-div">
                ID: {cardData?.member_phone}
              </div>
            </Row>
            <div className="card-date-info">
              <div>
                加入日期：
                {cardData?.created_at
                  ? dayjs(cardData.created_at).format("YYYY-MM-DD")
                  : ""}
              </div>
              <div>
                會籍到期日: 
                {cardData?.membership_expiry_date
                ? dayjs(cardData.membership_expiry_date).format("YYYY-MM-DD")
                : ""}
              </div>
            </div>
          </div>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ margin: "0.5rem 1.5rem" }}
          >
            <Form.Item
              name="member_name"
              label="名稱"
              rules={[{ required: true, message: "請輸入姓名" }]}
              className="form-label form-label-text"
              initialValue={cardData?.member_name}
            >
              <Input placeholder="Member Name" className="input-name" />
            </Form.Item>

            <Form.Item
              name="birthday"
              label="生日"
              rules={[{ required: true, message: "選擇日期" }]}
              className="form-label form-label-text"
            >
              <DatePicker
                picker="date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder={cardData?.birthday}
              />
            </Form.Item>

            <div id="change-pw-section">更改密碼</div>

            <Form.Item label="現時密碼" name="current_password" className="form-label">
              <Input.Password placeholder="輸入現時密碼" className="input-pw" />
            </Form.Item>

            <Form.Item label="新密碼" name="new_password" className="form-label">
              <Input.Password placeholder="輸入新密碼" className="input-pw" />
            </Form.Item>

            <Form.Item
              label="確認新密碼"
              name="confirm_password"
              className="form-label"
            >
              <Input.Password placeholder="重新輸入新密碼" className="input-pw" />
            </Form.Item>

            <Form.Item className="submit-section">
              <Button type="primary" htmlType="submit" id="submit-btn">
                儲存
              </Button>
            </Form.Item>
          </Form>
        </div>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <SmileOutlined style={{ fontSize: "24px" }} />
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>儲存成功 !</p>
        </div>
      </Modal>

    </>
  );
};

export default ProfilePage;
