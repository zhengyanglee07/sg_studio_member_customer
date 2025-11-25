// src/app/dashboard/member_order/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { List, Avatar, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "./MemberOrder.css";
import Image from "next/image";
import dayjs from "dayjs";

// interface OrderDetails {
//   order_id: string | number;
//   amount: number;
//   status: string;
//   // Add other specific order detail properties
//   [key: string]: any;
// }

const MemberOrderPage: React.FC = () => {
  const [cardData, setCardData] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>("redemption_items");
  const [loading, setLoading] = useState<boolean>(true);

  // Separate state variables for each list
  const [memberOrderData, setMemberOrderData] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<number, Order>>({});

  const router = useRouter();

  const fetchMemberOrderDetails = useCallback(async (order_id: number): Promise<Order | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member_order/get_member_member_order_detail/${order_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch details for order_id: ${order_id}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  }, []);

  const fetchAllOrderDetails = useCallback(async (orderList: any[]) => {
    try {
      for (const order of orderList) {
        const detail = await fetchMemberOrderDetails(order.order_id);
        if (detail && detail.order_id) {
          setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [detail.order_id]: detail,
          }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in fetching order details:", error);
      setLoading(false);
    }
  }, [fetchMemberOrderDetails]);

  useEffect(() => {
    // Fetch card data
    const fetchMemberOrderCard = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member_order/get_member_member_order_card`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };
    fetchMemberOrderCard();

    // Fetch data for all lists
    const loadOrders = async () => {
      const orderList = await fetchMemberOrderList();

      if (orderList.length > 0) {
        await fetchAllOrderDetails(orderList);
      } else {
        setLoading(false);
      }
    };
    loadOrders();
  }, [fetchAllOrderDetails]);

  const fetchMemberOrderList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member_order/get_member_member_order_list`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      const uniqueOrders: any[] = Array.from(new Map(data.map((item: any) => [item.order_id, item])).values());
      setMemberOrderData(uniqueOrders);
      return data;
    } catch (error) {
      console.error("Error fetching redemption items:", error);
      return [];
    }
  };

  interface Order {
    order_id: number;
    line_items: LineItem[];
  }

  interface LineItem {
    line_item_id: number;
    product_id: string;
    sku: string;
    item_name: string;
    item_qty: number;
    item_unit_price: number;
    item_subtotal_price: number;
    item_total_discount: number;
    item_total_price: number;
  }

  const handleMemberOrderClick = (redemptionItemId: string) => {
    router.push(`/dashboard/member_order/${redemptionItemId}`);
  };

  if (loading) {
    return <Spin style={{ display: "flex", justifyContent: "center", alignItems: "center" }} />;
  }

  return (
    <>
      <div id="background"></div>
      <div className="font" id="order-count">
        過往 12 個月消費次數: {cardData?.count_member_order}
      </div>

      <List
        itemLayout="vertical"
        split={true}
        dataSource={memberOrderData}
        id="order-list"
        renderItem={(item) => (
          <List.Item className="order-list-item">
            <List.Item.Meta
              title={
                <div className="title-container">
                  <div className="order-left">
                    <Image
                      src={"/dashboard/receipt.png"}
                      alt="Recepit"
                      width={0}
                      height={0}
                      className="order-icon"
                    />
                    <span className="order-id">#{item.order_id}</span>
                  </div>
                  <span className="order-date">
                    {dayjs(item.order_created_date).format("YYYY-MM-DD")}
                  </span>
                </div>
              }
              description={
                <>
                  <div className="order-details">
                    <span
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2px",
                        alignItems: "center",
                      }}
                    >
                      {/* order details */}
                      {orderDetails[item.order_id]?.line_items?.slice(0, 3).map((lineItem) => (
                        <div key={lineItem.line_item_id}>{lineItem.item_name}</div>
                      ))}
                      {/* Show ellipsis if more than 3 items */}
                      {orderDetails[item.order_id]?.line_items?.length > 3 && (
                        <div className="text-muted">...</div>
                      )}
                    </span>

                    {/* total price */}
                    <span className="total-price">$ {item.total_price}</span>
                  </div>
                  <div className="add-point">
                    <span className="point-sec" style={{ display: "flex", minWidth: "9rem" }}>
                      <Image
                        src={"/dashboard/point.png"}
                        alt="Point"
                        width={0}
                        height={0}
                        className="order-icon"
                      />
                      {item.point_earning ? `+ ${item.point_earning}` : 0} 積分
                    </span>
                    <span>
                      <Button
                        className="order-details-btn"
                        onClick={() => handleMemberOrderClick(item.order_id)}
                      >
                        <span style={{ textDecoration: "underline", letterSpacing: "1px", fontWeight: "600", fontSize: "14px" }} >詳情</span>▶
                      </Button>
                    </span>
                  </div>
                </>
              }
              style={{ marginBottom: 0 }}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default MemberOrderPage;
