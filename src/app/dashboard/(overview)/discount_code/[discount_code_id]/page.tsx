// src/app/dashboard/(overview)/discount_code/[discount_code_id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Button, message, Modal, Typography } from "antd";
import { ArrowLeftOutlined, FieldTimeOutlined, CopyOutlined, SmileOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import "./discount_code_detail_page.css";
import dayjs from "dayjs";
import QRCodeStyling from 'qr-code-styling';
import { useRef } from 'react';
import { getDiscountCodeDetail } from "@/lib/actions";

const DiscountCodeDetailPage: React.FC = () => {
  const [discountCodeData, setDiscountCodeData] = useState<any>(null);
  const [successCopyVisible, setSuccessCopyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const discount_code_id = params.discount_code_id;
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
      if (!discountCodeData?.discount_code || !qrRef.current) return;
    
      qrRef.current.innerHTML = ""; // clear previous QR
    
      qrCode.current = new QRCodeStyling({
        width: 160,
        height: 160,
        data: discountCodeData.discount_code,
        dotsOptions: {
          color: "#000000",
          type: "rounded",
        },
        backgroundOptions: {
          color: "transparent",
        },
      });
    
      qrCode.current.append(qrRef.current);
    }, [discountCodeData?.discount_code]);

  useEffect(() => {
    if (discount_code_id) {
      const fetchDiscountCodeDetails = async () => {
        try {
          const data = await getDiscountCodeDetail(discount_code_id as string);
          setDiscountCodeData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching discount code details:", error);
          setLoading(false);
        }
      };
      fetchDiscountCodeDetails();
    }
  }, [discount_code_id]);

  const handleBackBtnClick = () => {
    router.push(`/dashboard`);
  };

  if (loading) {
    return <Spin />;
  }

  const handleCopyRedeemCode = (code: string) => {
    if (!code) {
      message.error("No discount code available to copy!");
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setSuccessCopyVisible(true);
        setTimeout(() => setSuccessCopyVisible(false), 3000);
      })
      .catch(() => {
        message.error("Failed to copy discount code.");
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
      <Card id="card-parent" className="discount-card" rel="stylesheet">
        <Row justify="center" style={{ textAlign: 'center' }}>
          <div id="discount-card-title">{discountCodeData?.discount_code_name}</div>
        </Row>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <div id="discount-valid-time">
            <FieldTimeOutlined />
            {discountCodeData?.valid_until ? ` 尚餘 ${dayjs(discountCodeData?.valid_until).diff(dayjs(), 'day')} 日` : '---'} &nbsp;
          </div>
        </Row>
        <Row id="discount-point">
          <div ref={qrRef} style={{ marginBottom: '4px' }} />
        </Row>
        <Row>
          <div
            id="discount-code"
            onClick={() => handleCopyRedeemCode(discountCodeData?.discount_code)}
            style={{ cursor: "pointer" }}
          >
            {discountCodeData?.discount_code || "無優惠碼"} &nbsp;
            <CopyOutlined style={{ fontSize: '14px' }} />
          </div>
        </Row>
        <Row id="code-content" className="discount-card-title-section">
          {discountCodeData?.discount_code_content
            ?.replace(/\\n/g, '\n')
            .split('\n')
            .map((line: string, index: number) => (
              <div key={index}>{line.trim()}</div>
            ))
          }
        </Row>
      </Card>

      <p id="tNc">
        {discountCodeData?.discount_code_term
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

export default DiscountCodeDetailPage;