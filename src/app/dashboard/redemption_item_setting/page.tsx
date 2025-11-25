// src/app/dashboard/redemption_item_setting/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, Tabs, List, Avatar, Button, Row, Col } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "./RedemptionItemSetting.css";
import Image from "next/image";
import { getRedemptionItemSetting } from "@/lib/actions";

const RedemptionItemSettingPage: React.FC = () => {
  const [cardData, setCardData] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>("redemption_items");
  const [progress, setProgress] = useState(0);

  // Separate state variables for each list
  const [redemptionItemSettingData, setRedemptionItemSettingData] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Fetch card data
    // fetchRedemptionPageCard();
    fetchRedemptionItemSettingData();
  }, []);

  // const fetchRedemptionPageCard = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member/get_member_redemption_page_card`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //       }
  //     );
  //     const data = await response.json();
  //     setCardData(data);
  //     setProgress((data.points_balance / data.next_membership_tier_point) * 100);
  //   } catch (error) {
  //     console.error("Error fetching card data:", error);
  //   }
  // };

  const fetchRedemptionItemSettingData = async () => {
    try {
      const data = await getRedemptionItemSetting();
      const fallbackCardData = {
        membership_tier_sequence: 1,
      };

      setCardData(data.CardData || fallbackCardData);
      setRedemptionItemSettingData(
        data.RedemptionItems?.map((item: any) => ({
          ...item,
          minimum_membership_tier_sequence: item.minimum_membership_tier_sequence ?? 1,
          minimum_membership_tier_id: item.minimum_membership_tier_id ?? 1,
          minimum_membership_tier_name: item.minimum_membership_tier_name ?? "初階會員",
        })) || []
      );
    } catch (error) {
      console.error("Error fetching redemption items:", error);
      setCardData({ membership_tier_sequence: 1 });
    }
  };

  const handleRedemptionItemClick = (redemptionItemId: string) => {
    router.push(`/dashboard/redemption_item_setting/${redemptionItemId}`);
  };

  const getTierColor = (sequence: number) => {
    switch (sequence) {
      case 1:
        return "var(--text-gray)";
      case 2:
        return "var(--accent-blue)";
      case 3:
        return "var(--accent-pink)";
      case 4:
        return "var(--accent-purple)";
      default:
        return "var(--text-gray)";
    }
  };

  return (
    <>
      <div className="redemption-backdrop-parent"></div>
      <div id="redemption-page">
        <Card className="card">
          <Image src={'/dashboard/name-card.png'} alt="Redemption Background" width={471} height={300} id="card-bg-image" />
          <Row id="card-row">
            <Col span={24}>
              <div className="card-points-center">
                <div style={{ fontSize: "14px" }}>
                  &nbsp; 可使用積分餘額 &nbsp;
                  <Image src="/dashboard/point.png" alt="point" width={14} height={14} id="point-icon" />
                </div>
                <div id="card-point">{cardData?.points_balance}</div>
                <span style={{ color: '#737373', fontSize: '10px', fontWeight: '500' }}>會籍到期日: {cardData?.membership_expiry_date
                  ? new Date(cardData.membership_expiry_date).toLocaleDateString()
                  : ""}</span>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ fontSize: "12px", textAlign: 'left' }}>
                累計賺取積分總額
              </div>
              <span id="card-point-two">
                {cardData?.membership_period_point_earn}
              </span>
            </Col>
            <Col span={12} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "12px", textAlign: 'right' }}>
                距離下一等級尚欠
                <br />
                <span id="card-point-three">
                  &nbsp;{cardData?.point_to_next_tier}
                </span>
              </div>
            </Col>
            <Col span={24}>
              <span style={{ color: '#737373', fontSize: '9px', fontWeight: '500' }}>會藉開始日: {cardData?.membership_start_date
              ? new Date(cardData.membership_start_date
              ).toLocaleDateString() : ""}
              </span>
            </Col>
            <br />
            <Col span={24} style={{ textAlign: "center", width: 'auto' }} className="card-col">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${cardData?.next_membership_tier_point
                    ? Math.min((cardData.total_point_earn / cardData.next_membership_tier_point) * 100, 100)
                    : 0 }%`,
                  }}
                >
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Tabs activeKey={tabKey} className="tab-parent">
          <Tabs.TabPane tab={<><StarFilled className="filled-star" />可換領禮品</>} key="redemption_items" />
        </Tabs>

        {tabKey === "redemption_items" && (
          <List
            itemLayout="vertical"
            dataSource={redemptionItemSettingData}
            id="redemption-item-list"
            renderItem={(item) => {
              const isTierRestricted =
                !cardData?.membership_tier_sequence ||
                !item.minimum_membership_tier_sequence ||
                cardData.membership_tier_sequence < item.minimum_membership_tier_sequence;
              return (
                <List.Item
                  className={`available-redemption-item ${isTierRestricted ? "redemption-item-disabled" : ""}`}
                  extra={
                    <Button
                      className="available-item-details-btn"
                      onClick={() => handleRedemptionItemClick(item.redemption_item_id)}
                    >
                      <span style={{ textDecoration: "underline", letterSpacing: "1px", fontWeight: "600", fontSize: "14px" }}>
                        詳情
                      </span>
                      ▶ &nbsp;
                    </Button>
                  }
                >
                  <List.Item.Meta
                    className="redemption-item-main redemption-item-avatar discount-code-list-item-title"
                    avatar={<Avatar size={64} src='/dashboard/cash_ticket.png' className="available-coupon-img" style={{ opacity: isTierRestricted ? 0.75 : 1 }} />}
                    title={item.redemption_item_name}
                    description={
                      <>
                        <div style={{ verticalAlign: "bottom", fontWeight: 500, fontSize: "14px", color: "var(--brown)", opacity: isTierRestricted ? 0.75 : 1 }}>
                          <Image src="/dashboard/point.png" alt="point" width={14} height={14} id="point-icon" />
                          {item.redeem_point} 積分
                        </div>

                        {item.minimum_membership_tier_id && item.minimum_membership_tier_name && (
                          <div style={{ fontWeight: "500", fontSize: "10px", marginTop: "4px" }}>
                            限 &nbsp;
                            <Image src={`/dashboard/lvl-b${item.minimum_membership_tier_sequence}.png`} alt={`${item.minimum_membership_tier_name}`} width={12} height={12} style={{ verticalAlign: "middle" }} unoptimized />
                            <span style={{ color: getTierColor(item.minimum_membership_tier_sequence) }}>
                              &nbsp;{item.minimum_membership_tier_name}
                            </span>
                            &nbsp;級別以上會員
                          </div>
                        )}
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </>
  );
};

export default RedemptionItemSettingPage;