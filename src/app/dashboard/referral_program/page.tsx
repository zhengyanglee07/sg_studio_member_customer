// src/app/dashboard/membership_tier/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Tabs, List, Avatar, Modal, Button, Row, Col, } from "antd";
import { CopyOutlined, SmileOutlined } from "@ant-design/icons";
import Image from "next/image";
import "./ReferralProgram.css";
import { getMemberReferralDetail } from "@/lib/actions";

const ReferralProgramPage: React.FC = () => {

  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [referralData, setReferralData] = useState({
    referral_code: "",
    member_phone: "",
    points_per_referral: 0,
    total_points_earn_by_referral: 0,
    referral_count: 0
  });

  useEffect(() => {
    const fetchReferralDetail = async () => {
      try {
        const data = await getMemberReferralDetail();
        setReferralData(data);
      } catch (err) {
        console.error("Failed to fetch referral summary:", err);
      }
    };
    fetchReferralDetail();
  }, []);

  const handleCopyReferralCode = async () => {
    if (!referralData.referral_code) return;
    await navigator.clipboard.writeText(referralData.referral_code);
    setSuccessModalVisible(true);
    setTimeout(() => {
      setSuccessModalVisible(false);
    }, 2000);
  };

  return (
    <>
      <div className="referral-program">
        <p className="referral-title">朋友推薦</p>
        <Image
          src="/black-sg-studio-logo.png"
          alt="Icon"
          width={150}
          height={150}
          style={{ objectFit: 'contain' }}
          className="referral-company-logo"
        />
        <p className="referral-title-two">邀請你的朋友註冊成為會員!</p>
        <Row gutter={[8, 8]} className="referral-data-section">
          <Col span={8} className="referral-data">
            推薦人可獲積分<br />
            <span className="referral-data-num">{referralData.points_per_referral}</span>
          </Col>
          <Col span={8} className="referral-data">
            推薦所獲積分<br />
            <span className="referral-data-num">{referralData.total_points_earn_by_referral}</span>
          </Col>
          <Col span={8} className="referral-data">
            推薦人總數<br />
            <span className="referral-data-num">{referralData.referral_count}</span>
          </Col>
        </Row>
        <Col className="referral-code-section">
          我的推薦碼
          <div className="referral-code" onClick={handleCopyReferralCode} style={{ cursor: "pointer" }}>
            <span>{referralData.referral_code || '尚未分配'}</span>
            <span style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)"
            }}>
              <CopyOutlined style={{ fontSize: '16px' }} />
            </span>
          </div>
          <Button
            type="text"
            className="share-referral-btn"
            onClick={() => {
              const referralCode = referralData.referral_code;
              const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
              const shareText = `立即註冊成為會員並輸入推薦碼「${referralCode}」即可獲得積分獎勵！點擊註冊：${shareUrl}`;

              if (navigator.share) {
                navigator.share({
                  title: "朋友推薦註冊",
                  text: shareText,
                  url: shareUrl,
                }).catch((error) => console.error("分享失敗:", error));
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert("分享連結已複製：\n" + shareUrl);
              }
            }}
          >
            立即邀請
          </Button>

        </Col>

        <div className="referral-question-section">
          <h3 className="referral-question">如何邀請你的朋友?</h3>
          <div className="referral-step-row">
              <Image src="/dashboard/numbering1.png" alt="Step 1" width={30} height={30} className="step-icon" />
            <p className="step-text">將您的推薦碼分享給您的朋友。</p>
          </div>
          <div className="referral-step-row">
            <Image src="/dashboard/numbering2.png" alt="Step 2" width={30} height={30} className="step-icon" />
            <p className="step-text">你的朋友透過您的推薦碼完成會員註冊。</p>
          </div>
        </div>

        <div style={{ height: '50px', position: 'relative' }}></div>
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
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>已複製推薦碼!</p>
        </div>
      </Modal>
    </>
  );
};

export default ReferralProgramPage;
