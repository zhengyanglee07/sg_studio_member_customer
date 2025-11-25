// src/app/dashboard/(overview)/redemption_item/[redemption_record_id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Button, Modal, message, Typography } from "antd";
import { ArrowLeftOutlined, FieldTimeOutlined, GiftOutlined, CopyOutlined, SmileOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import "./redemption_item_detail_page.css";
import dayjs from "dayjs";
import QRCodeStyling from 'qr-code-styling';
import { useRef } from 'react';
import { getRedemptionItemRecordDetail } from "@/lib/actions";

const RedemptionItemSettingDetailPage: React.FC = () => {
  const [redemptionItemData, setRedemptionItemData] = useState<any>(null);
  const [successCopyVisible, setSuccessCopyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const redemption_record_id = params.redemption_record_id;
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!redemptionItemData?.redeem_code || !qrRef.current) return;
  
    qrRef.current.innerHTML = ""; // clear previous QR
  
    qrCode.current = new QRCodeStyling({
      width: 160,
      height: 160,
      data: redemptionItemData.redeem_code,
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "transparent",
      },
    });
  
    qrCode.current.append(qrRef.current);
  }, [redemptionItemData?.redeem_code]);

  useEffect(() => {
    if (redemption_record_id) {
      const fetchRedemptionItemDetails = async () => {
        try {
          const data = await getRedemptionItemRecordDetail(redemption_record_id as string);
          setRedemptionItemData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching redemption item details:", error);
          setLoading(false);
        }
      };
      fetchRedemptionItemDetails();
    }
  }, [redemption_record_id]);

  const handleBackBtnClick = () => {
    router.push(`/dashboard`);
  };

  if (loading) {
    return <Spin />;
  }

  const handleCopyRedeemCode = (code: string) => {
    if (!code) {
      message.error("No redeem code available to copy!");
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setSuccessCopyVisible(true);
        setTimeout(() => setSuccessCopyVisible(false), 3000);
      })
      .catch(() => {
        message.error("Failed to copy redeem code.");
      });
  };


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
      <Card id="card-parent" className="redemption-record-card" rel="stylesheet">
        <Row justify="center" style={{ textAlign: 'center' }}>
          <div id="redeem-card-title">{redemptionItemData?.redemption_item_name}</div>
        </Row>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <div id="redeem-valid-time">
            <FieldTimeOutlined />
            {redemptionItemData?.validity_period ? ` 尚餘 ${dayjs(redemptionItemData?.validity_period).diff(dayjs(), 'day')} 日` : '---'} &nbsp;
          </div>
        </Row>
        <Row id="redeem-point">
          <div ref={qrRef} style={{ marginBottom: '4px' }} />
        </Row>
        <Row>
          <div
            id="redeem-code"
            onClick={() => handleCopyRedeemCode(redemptionItemData?.redeem_code)}
            style={{ cursor: "pointer" }}
          >
            {redemptionItemData?.redeem_code || "無優惠碼"} &nbsp;
            <CopyOutlined style={{ fontSize: '14px' }} />
          </div>
        </Row>
        <Row id="code-content" className="redeem-card-title-section">
          {redemptionItemData?.redemption_content
            ?.replace(/\\n/g, '\n')
            .split('\n')
            .map((line: string, index: number) => (
              <div key={index}>{line.trim()}</div>
            ))
          }
        </Row>
      </Card>

      <p id="tNc">
        {redemptionItemData?.redemption_term
          ?.replace(/\\n/g, '\n')
          .split('\n')
          .map((line: string, index: number) => (
            <span key={index}>
              {line.trim()}
              <br />
            </span>
          ))
        }
      </p>

      <div id="footer"></div>

      <Modal
        centered
        open={successCopyVisible}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setSuccessCopyVisible(false)}
        style={{ padding: '14px', textAlign: 'center' }}
        width={300}
      >
        <Row align="middle" justify="center" gutter={16}>
          <Col>
            <SmileOutlined style={{ fontSize: '32px', color: 'green' }} />
          </Col>
          <Col>
            <Typography.Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
              複製成功!
            </Typography.Text>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default RedemptionItemSettingDetailPage;