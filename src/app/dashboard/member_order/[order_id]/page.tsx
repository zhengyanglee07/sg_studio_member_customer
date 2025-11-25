// src/app/dashboard/member_order/[order_id]/page.tsx

"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Button, List, Divider } from "antd";
import { ArrowLeftOutlined, GiftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
// import "../../general_detail_page.css";
import "./member_order_detail_page.css"

const MemberOrderDetailPage: React.FC = () => {
  const [memberOrderData, setMemberOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const params = useParams();
  const order_id = params.order_id;

  // Define interfaces
  interface LineItemDiscount {
    line_item_discount_id: number;
    discount_type: string;
    discount_code: string;
    discount_amount: number;
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
    line_item_discounts: LineItemDiscount[];
  }

  interface DiscountCode {
    order_discount_id: number;
    discount_type: string;
    discount_code: string;
    discount_amount: number;
  }

  useEffect(() => {
    if (order_id) {
      const fetchMemberOrderDetails = async () => {
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
          const data = await response.json();

          // format the data
          const formattedOrderData = {
            ...data,
            description: (
              <div>
                {/* Line Items */}
                {data.line_items.map((item: LineItem) => (
                  <div key={item.line_item_id} className="margin-btm">
                    <div className="bold-text">{item.item_name}</div>
                    <div className="flex-space-between normal-text">
                      <span className="">${item.item_unit_price}</span>
                      <span>X{item.item_qty}</span>
                      <span>${item.item_subtotal_price}</span>
                    </div>
                  </div>

                ))}
                {/* Order-level Discount Codes */}
                {data.discount_codes.length > 0 && (
                  <div className="bold-text margin-btm">優惠碼
                    {data.discount_codes.map((discount: DiscountCode, index: number) => (
                      <div key={index} className="flex-space-between">
                        <span className="bold-text discount-code">{discount.discount_code}</span>
                        <span className="normal-text">-${discount.discount_amount}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Order Summary */}
                <div id="order-summary">
                  <div className="flex-column " id="total-unit-item">
                    <div>項目總數</div>
                    <div>{data.line_items.length}</div>
                  </div>
                  <div className="flex-column">
                    <div>總計</div>
                    <div>${data.line_items.reduce((total: number, item: LineItem) => total + item.item_total_price, 0).toFixed(2)}</div>
                  </div>
                </div>
                {/* Point Earned */}
                <div id="point-earned-section">賺取積分
                  <Image src={'/dashboard/point.png'} alt="Point" width={0} height={0} id="point-icon" />
                  <span id="point-earned">{/* {data.point_earning !== null ? data.point_earning : 'N/A'} */}
                    30</span>
                </div>
              </div>
            )
          };

          setMemberOrderData(formattedOrderData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching order details:", error);
          setLoading(false);
        }
      };
      fetchMemberOrderDetails();
    }
  }, [order_id]);

  if (loading) {
    return <Spin />;
  }

  const handleBackBtnClick = () => {
    router.push(`/dashboard/member_order`);
  };

  return (
    <>
      <div id="background"></div>
      <div id="back-page">
        <Button type="link" variant="link" onClick={() => handleBackBtnClick()} id="back-btn">
          <span style={{ fontSize: "24px", marginRight: "4px" }}>
            <ArrowLeftOutlined />
          </span> 其他推廣活動
        </Button>
      </div>
      <List
        itemLayout="vertical"
        split={true}
        dataSource={[memberOrderData].filter(Boolean)}
        id=""
        className="order-list-details-item"
        renderItem={(order) => (
          <List.Item className="order-list-item">
            <List.Item.Meta
              title={
                <div className="title-container">
                  <span style={{ display: 'flex' }}>
                    <Image src={'/dashboard/receipt.png'} alt="Receipt" width={0} height={0} className="order-icon" />
                    <span> #{order_id}</span>
                  </span>
                  <span style={{ color: '#737277' }}>
                    {dayjs(order.order_created_date).format('YYYY-MM-DD')}
                  </span>
                </div>
              }
              description={order.description}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default MemberOrderDetailPage;