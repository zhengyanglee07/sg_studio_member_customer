// src/app/dashboard/redemption_item_setting/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Button, Modal } from "antd";
import { ArrowLeftOutlined, FieldTimeOutlined, GiftOutlined, FrownOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import "./redeem_item_detail_page.css";
import Image from "next/image";
import { getMemberDashboardCard, getRedemptionItemDetail, redeemItem } from "@/lib/actions";

const RedemptionItemSettingDetailPage: React.FC = () => {
  const [redemptionItemData, setRedemptionItemData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redeemSuccess, setRedeemSuccess] = useState<boolean>(false);
  const [redeemFailureModalVisible, setRedeemFailureModalVisible] = useState<boolean>(false);
  const [accessDeniedModalVisible, setAccessDeniedModalVisible] = useState<boolean>(false);
  const [cardData, setCardData] = useState<any>(null);

  const router = useRouter();
  const params = useParams();
  const redemption_item_id = params.redemption_item_id;

  const isRedeemDisabled = redemptionItemData?.redeem_count_limit === "once" && redemptionItemData?.has_redeemed;
  const isTierRestricted = !isRedeemDisabled && cardData?.membership_tier_sequence < redemptionItemData?.minimum_membership_tier_sequence;
  const redeemButtonText = isRedeemDisabled
    ? "已換領過了"
    : isTierRestricted
    ? "會員等級不足"
    : "立即換領";

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const data = await getMemberDashboardCard();
        setCardData(data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };
    fetchCardData();
  }, []);

  useEffect(() => {
    const fetchRedemptionItemDetails = async () => {
      try {
        const data = await getRedemptionItemDetail(redemption_item_id as string);
        console.log("Redemption item response:", data);
        setRedemptionItemData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching redemption item details:", error);
        setLoading(false);
      }
    };
    if (redemption_item_id) fetchRedemptionItemDetails();
  }, [redemption_item_id]);

  if (loading) return <Spin />;

  const handleRedeemNow = async () => {
    if (isRedeemDisabled) return;
    if (isTierRestricted) {
      setAccessDeniedModalVisible(true);
      setTimeout(() => setAccessDeniedModalVisible(false), 3000);
      return;
    }

    try {
      const result = await redeemItem({ redemption_item_id: redemption_item_id as string });
      if (result.success) {
        setRedeemSuccess(true);
      } else {
        setRedeemFailureModalVisible(true);
        setTimeout(() => setRedeemFailureModalVisible(false), 3000);
      }
    } catch (error) {
      setRedeemFailureModalVisible(true);
      setTimeout(() => setRedeemFailureModalVisible(false), 3000);
    }
  };

  const handleBackBtnClick = () => router.push(`/dashboard/redemption_item_setting`);
  const handleRedeemedBtnClick = () => router.push(`/dashboard`);

  const tierSequence = redemptionItemData?.minimum_membership_tier_sequence ?? 1;
  const tierName = redemptionItemData?.minimum_membership_tier_name ?? "\u521d\u968e\u6703\u54e1";

  const getTierColor = (sequence: number) => {
    switch (sequence) {
      case 1: return "var(--text-gray)";
      case 2: return "var(--accent-blue)";
      case 3: return "var(--accent-pink)";
      case 4: return "var(--accent-purple)";
      default: return "var(--text-gray)";
    }
  };

  const getTierIcon = (sequence: number) => {
    switch (sequence) {
      case 1: return "/dashboard/lvl-b1.png";
      case 2: return "/dashboard/lvl-b2.png";
      case 3: return "/dashboard/lvl-b3.png";
      case 4: return "/dashboard/lvl-b4.png";
      default: return "/dashboard/lvl-b1.png";
    }
  };

  return (
    <>
      <div id="detail-page-background"></div>
      <div id="back-page">
        <Button type="link" onClick={handleBackBtnClick} id="back-btn">
          <ArrowLeftOutlined style={{ fontSize: "24px", marginRight: "4px" }} />其他禮品
        </Button>
      </div>

      {redeemSuccess ? (
        <div id="redeem-success-container">
          <Card id="redeem-success-card">
            <Row gutter={[16, 16]} id="success-card-title">
              <Col span={7}><Avatar size={50} src="/dashboard/cash_ticket.png" className="coupon-item-img" /></Col>
              <Col span={16}><div id="card-title">換領成功！</div></Col>
            </Row>
            <Row id="redeemed-btn-section">
              <Button type="primary" onClick={handleRedeemedBtnClick} id="redeem-btn">
                <GiftOutlined />檢視我的優惠券
              </Button>
            </Row>
          </Card>
        </div>
      ) : (
        <>
          <Card id="card-parent" className="redeem-item-detail-card" style={{ opacity: isTierRestricted ? 0.75 : 1 }}>
            <Row gutter={[8, 8]} className="card-title-section">
              <Col span={6}><Avatar size={60} src="/dashboard/cash_ticket.png" className="coupon-item-img" /></Col>
              <Col span={17}>
                <div id="card-title">{redemptionItemData?.redemption_item_name}</div>
                <div id="valid-time">
                  <FieldTimeOutlined />
                  {redemptionItemData?.validity_period ? ` 有效期：${redemptionItemData.validity_period}個月` : "---"}
                </div>
                <div className="membership-limit">
                  限 &nbsp;
                  <Image src={getTierIcon(tierSequence)} alt={tierName} width={12} height={12} style={{ verticalAlign: "top" }} />
                  <span className="membership-tier" style={{ color: getTierColor(tierSequence) }}>
                    &nbsp;{tierName}
                  </span>
                  &nbsp;級別以上會員
                </div>
              </Col>
            </Row>
            <Row id="code-content">
              {redemptionItemData?.redemption_content
                ?.split('\n')
                .map((line: string, index: number) => (
                  <div key={index}>{line.trim()}</div>
                ))
              }
            </Row>
            <br />
            <Row id="redeem-btn-section">
              <div id="point-section">
                <span id="point-title">換領所需積分 :</span>
                <Image src="/dashboard/point.png" alt="Card Background" id="point-image" width={0} height={0} />
                <span id="points-text">&nbsp;{redemptionItemData?.redeem_point}</span>
              </div>
              <Button
                type="primary"
                onClick={handleRedeemNow}
                id="redeem-btn"
                disabled={isRedeemDisabled || isTierRestricted}
                style={{
                  opacity: (isRedeemDisabled || isTierRestricted) ? 0.95 : 1,
                  cursor: (isRedeemDisabled || isTierRestricted) ? "not-allowed" : "pointer",
                  color: (isRedeemDisabled || isTierRestricted) ? "#595959" : "white",
                  borderColor: (isRedeemDisabled || isTierRestricted) ? "#d9d9d9" : undefined,
                  backgroundColor: (isRedeemDisabled || isTierRestricted) ? "#f5f5f5" : undefined
                }}
              >
                {!(isRedeemDisabled || isTierRestricted) && <GiftOutlined />}
                {redeemButtonText}
              </Button>              
            </Row>
          </Card>
          <p id="tNc">
            {redemptionItemData?.redemption_term
              ?.split('\n')
              .map((line: string, index: number) => (
                <span key={index}>{line.trim()}<br /></span>
              ))}
          </p>
        </>
      )}

      <Modal centered open={redeemFailureModalVisible} footer={null} closable={false} maskClosable={true} onCancel={() => setRedeemFailureModalVisible(false)} style={{ padding: "14px", textAlign: "center" }} width={300}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px" }}>
          <FrownOutlined style={{ fontSize: "36px" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>換領失敗！</p>
            <p style={{ fontSize: "14px", color: "#595959", margin: 0 }}>積分不足 &nbsp;</p>
          </div>
        </div>
      </Modal>

      <Modal centered open={accessDeniedModalVisible} footer={null} closable={false} maskClosable={true} onCancel={() => setAccessDeniedModalVisible(false)} style={{ padding: "14px", textAlign: "center" }} width={300}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px" }}>
          <FrownOutlined style={{ fontSize: "36px" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>無法換領！</p>
            <p style={{ fontSize: "14px", color: "#595959", margin: 0 }}>您的會員等級未達此禮品門檻</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RedemptionItemSettingDetailPage;