"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Button, Row, Col } from "antd";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import "./ServiceDetails.css";

interface ServiceDetail {
  service_detail_id: string;
  service_detail_title: string;
  service_detail_category: string;
  service_detail_price: number | null;
  service_detail_price_np?: number | null;
  service_detail_description: string;
}

const ServiceDetailsContent: React.FC = () => {
  const { service_detail_id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const alpha = searchParams.get("alpha") || "a";

  useEffect(() => {

    console.log("service_detail_id", service_detail_id);

    const fetchServiceDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/member_product/get_service_detail/${service_detail_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        const raw = data.data?.[0];

        if (!raw) {
          console.error("No service detail found");
          return;
        }

        const serviceDetail: ServiceDetail = {
          service_detail_id: raw.product_id,
          service_detail_title: raw.title,
          service_detail_category: raw.collections?.[0]?.title ?? "未知分類",
          service_detail_price: raw.variants?.[0]?.price ?? null,
          service_detail_price_np: raw.variants?.[0]?.compare_price ?? null,
          service_detail_description: raw.description_html ?? "",
        };

        setService(serviceDetail);
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [service_detail_id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div id="service-background"></div>
      <div id="back-page">
        <Button type="link" id="back-btn" onClick={() => router.back()}>
          <span style={{ fontSize: "24px", marginRight: "4px" }}>
            <ArrowLeftOutlined />
          </span>
          返回
        </Button>
      </div>
      <div className="service-container">
        {loading ? (
          <div className="loading-message">資料載入中...</div>
        ) : (
          <div className="service-details-body">
            <div className="service-img-wrapper">
              <Image
                src={`/alphabet-wg/g${alpha}.png`}
                alt="service icon"
                width={45}
                height={45}
                onError={(e) => {
                  e.currentTarget.src = "/alphabet-wg/ga.png";
                }}
              />
            </div>
            <div className="service-content">
              <div className="service-title">{service?.service_detail_category}</div>
            </div>
            <div className="service-category-main-title">{service?.service_detail_title}</div>

            <Row className="price-card">
              <Col span={24} className="price-option-one">
                <div className="label">每次服務</div>
                <div className="price">${service?.service_detail_price ?? "N/A"}</div>
                <div className="np">原價: ${service?.service_detail_price_np ?? "N/A"}</div>
              </Col>
            </Row>

            <div className="description-tab">Description</div>
            <div
              className="description-details"
              dangerouslySetInnerHTML={{ __html: service?.service_detail_description || "" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const ServiceDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="loading-message">資料載入中...</div>}>
      <ServiceDetailsContent />
    </Suspense>
  );
};

export default ServiceDetailsPage;
