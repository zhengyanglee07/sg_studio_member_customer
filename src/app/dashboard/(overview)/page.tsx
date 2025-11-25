// src/app/dashboard/(overview)/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, Tabs, List, Avatar, Button, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import "./DashboardOverview.css";

import {
  CheckSquareOutlined,
  FieldTimeOutlined,
  StarFilled,
  StarOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import dayjs from "dayjs";
import { getDiscountCodeList, getRedemptionItemRecordList, getExpiredRedemptionItemRecordList } from "@/lib/actions";

// Membership avatar mapping - defined outside component to avoid recreation
const membershipAvatar: Record<number, string> = {
  1: "/dashboard/lvl-b1.png",
  2: "/dashboard/lvl-b2.png",
  3: "/dashboard/lvl-b3.png",
  4: "/dashboard/lvl-b4.png",
};

const DashboardPage: React.FC = () => {
  const [cardData, setCardData] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>("discount_codes");
  const [avatarSrc, setAvatarSrc] = useState<string>(
    "/dashboard/lvl-b1.png"
  );

  // Separate state variables for each list
  const [discountCodesData, setDiscountCodesData] = useState<any[]>([]);
  const [redemptionItemsData, setRedemptionItemsData] = useState<any[]>([]);
  const [expiredRedemptionItemsData, setExpiredRedemptionItemsData] = useState<
    any[]
  >([]);

  const router = useRouter();

  // Separate fetch functions for each list
  const fetchDiscountCodesData = useCallback(async () => {
    try {
      const data = await getDiscountCodeList();
      setDiscountCodesData(data.MemberDiscountCode);
      setCardData(data.CardData);
      setAvatarSrc(membershipAvatar[data.CardData.membership_tier_sequence ?? 1]);
    } catch (error) {
      console.error("Error fetching discount codes:", error);
    }
  }, []);

  useEffect(() => {
    // fetchDashboardCard();
    fetchDiscountCodesData();
  }, [fetchDiscountCodesData]);

  // Fetch card data
  // const fetchDashboardCard = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member/get_member_dashboard_card`,
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
  //     setAvatarSrc(membershipAvatar[data.membership_tier_id]);
  //   } catch (error) {
  //     console.error("Error fetching card data:", error);
  //   }
  // };

  const fetchRedemptionItemsData = async () => {
    try {
      const data = await getRedemptionItemRecordList();
      setRedemptionItemsData(data);
    } catch (error) {
      console.error("Error fetching redemption items:", error);
    }
  };

  const fetchExpiredRedemptionItemsData = async () => {
    try {
      const data = await getExpiredRedemptionItemRecordList();
      setExpiredRedemptionItemsData(data);
    } catch (error) {
      console.error("Error fetching expired redemption items:", error);
    }
  };

  const handleTabChange = (key: string) => {
    setTabKey(key);

    // Optionally fetch data on tab change
    if (key === "discount_codes") {
      fetchDiscountCodesData();
    } else if (key === "redemption_items") {
      fetchRedemptionItemsData();
    } else if (key === "expired_redemption_items") {
      fetchExpiredRedemptionItemsData();
    }
  };

  // Separate handle click functions
  const handleDiscountCodeClick = (discountCodeId: string) => {
    router.push(`/dashboard/discount_code/${discountCodeId}`);
  };

  const handleRedemptionItemClick = (redemptionItemId: string) => {
    router.push(`/dashboard/redemption_item/${redemptionItemId}`);
  };

  const handleExpiredRedemptionItemClick = (redemptionItemId: string) => {
    router.push(`/dashboard/expired_redemption_item/${redemptionItemId}`);
  };

  return (
    <>
      <div className="backdrop-parent">
        <div className="backdrop"></div>
        <div className="dashboard">
          <Card id="card">
            <Image
              src="/dashboard/name-card.png"
              alt="Card Background"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "100%",
                background: "white",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
              }}
            />
            <Row className="card-content" style={{ width: "100%", height: "100%" }}>
              <Col
                span={10}
                style={{ textAlign: "center" }}
                className="avatar card-item"
              >
                <Avatar size={85} src={avatarSrc} />
                <div className="font-heavy">
                  {cardData?.membership_tier_name}
                </div>
              </Col>
              <Col span={14} className="point-container card-item">
                <div className="available-points">
                  <span id="available-points-text">可使用積分&nbsp;</span>
                  <Image
                    src="/dashboard/point.png"
                    alt="Point Icon"
                    width={0}
                    height={0}
                    id="point-icon"
                  />
                </div>
                <span
                  style={{
                    fontSize: "3em",
                    fontWeight: "900",
                    marginBottom: "10px",
                  }}
                >
                  {cardData?.points_balance}
                </span>
                <div id="member-expiry-date">
                  會籍到期日:{" "}
                  {cardData?.membership_expiry_date
                    ? dayjs(cardData.membership_expiry_date).format("YYYY-MM-DD")
                    : ""}
                </div>
              </Col>
            </Row>
          </Card>

          <Tabs activeKey={tabKey} onChange={handleTabChange}>
            <Tabs.TabPane
              tab={
                <>
                  {tabKey === "discount_codes" ? (
                    <StarFilled className="filled-star" />
                  ) : (
                    <StarOutlined />
                  )}
                  &nbsp;推廣活動 &nbsp;
                </>
              }
              key="discount_codes"
            />
            <Tabs.TabPane
              tab={
                <>
                  {tabKey === "redemption_items" ? (
                    <StarFilled className="filled-star" />
                  ) : (
                    <StarOutlined />
                  )}
                  &nbsp;我的優惠券 &nbsp;
                </>
              }
              key="redemption_items"
            />
            <Tabs.TabPane
              tab={
                <>
                  {tabKey === "expired_redemption_items" ? (
                    <StarFilled className="filled-star" />
                  ) : (
                    <StarOutlined />
                  )}
                  &nbsp;過去的優惠券 &nbsp;
                </>
              }
              key="expired_redemption_items"
            />
          </Tabs>

          {tabKey === "discount_codes" && (
            <List
              itemLayout="vertical"
              dataSource={discountCodesData}
              className="discount-code-list"
              renderItem={(item) => (
                <List.Item
                  className="discount-code-list-item"
                  extra={
                    <Button
                      className="details-btn"
                      onClick={() =>
                        handleDiscountCodeClick(item.discount_code_id)
                      }
                    >
                      <span style={{ textDecoration: "underline", letterSpacing: "1px", fontWeight: "600", fontSize: "14px" }}>詳情</span>
                      ▶ &nbsp;
                    </Button>
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar size={65} src="/dashboard/promo_ticket.png" />}
                    title={
                      <div className="discount-code-content">
                        <div className="discount-code-title">{item.discount_code_name}</div>
                        <span className="discount-code-description">
                          <FieldTimeOutlined />
                          {item.valid_until
                            ? ` 尚餘 ${dayjs(item.valid_until).diff(dayjs(), "day")} 日`
                            : "---"}
                        </span>
                      </div>
                    }
                    className="discount-code-list-item-title"
                    style={{ marginBlockEnd: "10px" }}
                  />
                </List.Item>
              )}
            />
          )}

          {tabKey === "redemption_items" && (
            <List
              itemLayout="vertical"
              dataSource={redemptionItemsData}
              // dataSource={discountCodesData}
              renderItem={(item) => (
                <List.Item
                  className="redemption-item"
                  extra={
                    <Button
                      className="details-btn"
                      onClick={() =>
                        handleRedemptionItemClick(item.redemption_record_id)
                      }
                    >
                      <span style={{ textDecoration: "underline", letterSpacing: "1px", fontWeight: "600", fontSize: "14px" }}>詳情</span>
                      ▶ &nbsp;
                    </Button>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={70}
                        src="/dashboard/cash_ticket.png"
                        className="coupon-img"
                      />
                    }
                    title={
                      <div className="redemption-item-content">
                        <div className="redemption-item-title">{item.redemption_item_name}</div>
                        <span className="redemption-item-description">
                          <FieldTimeOutlined />
                          {item.valid_until
                            ? ` 尚餘 ${dayjs(item.valid_until).diff(dayjs(), "day")} 日`
                            : "---"}
                        </span>
                      </div>
                    }
                    className="redemption-item-meta"
                  />
                </List.Item>
              )}
            />
          )}

          {tabKey === "expired_redemption_items" && (
            <List
              itemLayout="vertical"
              dataSource={expiredRedemptionItemsData}
              // dataSource={discountCodesData}
              renderItem={(item) => (
                <List.Item
                  className="redemption-item-expired expired"
                  extra={
                    <Button
                      className="details-btn"
                      onClick={() =>
                        handleExpiredRedemptionItemClick(
                          item.expired_redemption_record_id
                        )
                      }
                    >
                      <span style={{ textDecoration: "underline", letterSpacing: "1px", fontWeight: "600", fontSize: "14px" }}>詳情</span>
                      ▶ &nbsp;
                    </Button>
                  }
                >
                  <List.Item.Meta
                    // avatar={<Avatar size={64} src="/dashboard/percentage_ticket.png" className="coupon-img" />}
                    avatar={
                      <Avatar
                        size={65}
                        src="/dashboard/cash_ticket.png"
                        className="coupon-img"
                      />
                    }
                    title={
                      <div className="redemption-item-expired-content">
                        <div className="redemption-item-expired-title">{item.expired_redemption_item_name}</div>
                        <span className="redemption-item-expired-description expired">
                          <CheckSquareOutlined /> 已過期
                        </span>
                      </div>
                    }
                    className="redemption-item-expired-meta"
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
