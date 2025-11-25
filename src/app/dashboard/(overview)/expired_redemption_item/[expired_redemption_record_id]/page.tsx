// src/app/dashboard/(overview)/expired_redemption_item/[expired_redemption_record_id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Button } from "antd";
import { ArrowLeftOutlined, CheckSquareOutlined, FrownOutlined, GiftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import "./expired_code_detail_page.css";
import dayjs from "dayjs";
import { getExpiredRedemptionItemRecordDetail } from "@/lib/actions";

const ExpiredRedemptionItemSettingDetailPage: React.FC = () => {
  const [expiredRedemptionItemData, setExpiredRedemptionItemData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const expired_redemption_record_id = params.expired_redemption_record_id;
  console.log("params", params);
  console.log("expired_redemption_record_id", expired_redemption_record_id);
  useEffect(() => {
    if (expired_redemption_record_id) {
      const fetchExpiredRedemptionItemDetails = async () => {
        try {
          const data = await getExpiredRedemptionItemRecordDetail(expired_redemption_record_id as string);
          setExpiredRedemptionItemData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching redemption item details:", error);
          setLoading(false);
        }
      };
      fetchExpiredRedemptionItemDetails();
    }
  }, [expired_redemption_record_id]);

  const handleBackBtnClick = () => {
    router.push(`/dashboard`);
  };

  if (loading) {
    return <Spin />;
  }


  return (
    <>
      <div id="detail-page-background"></div>
      <div id="back-page">
        <Button type="link" variant="link" onClick={() => handleBackBtnClick()} id="back-btn">
          <span style={{ fontSize: "24px", marginRight: "4px" }}>
            <ArrowLeftOutlined />
          </span> 其他推廣活動
        </Button>
      </div>
      <Card id="card-parent" className="expired-redemption-card" rel="stylesheet">
        <Row gutter={[8, 8]} className="expired-card-title-section">
          <Col span={7}>
            <Avatar size={75} src="/dashboard/cash_ticket.png" />
          </Col>
          <Col span={17}>
            <div id="card-title">{expiredRedemptionItemData?.redemption_item_name}</div>
            <div id="expired-time">
              {expiredRedemptionItemData?.valid_until ?
                (dayjs(expiredRedemptionItemData.valid_until).isAfter(dayjs())
                  ? <span><CheckSquareOutlined /> 使用日期：{dayjs(expiredRedemptionItemData.end_date).format('YYYY-MM-DD')}</span>
                  : <span><FrownOutlined /> 到期日：{dayjs(expiredRedemptionItemData.valid_until).format('YYYY-MM-DD')}</span>
                ) : '---'}
            </div>
          </Col>
        </Row>
        <Row id="code-content">
          {expiredRedemptionItemData?.redemption_term
            ?.replace(/\\n/g, '\n')
            .split('\n')
            .map((line: string, index: number) => (
              <span key={index}>
                {line.trim()}
                <br />
              </span>
            ))
          }
        </Row>

      </Card>

      <p id="tNc">
        {expiredRedemptionItemData?.redemption_content
          ?.replace(/\\n/g, '\n')
          .split('\n')
          .map((line: string, index: number) => (
            <div key={index}>{line.trim()}</div>
          ))
        }
      </p>

      <div id="footer"></div>
    </>
  );
};

export default ExpiredRedemptionItemSettingDetailPage;