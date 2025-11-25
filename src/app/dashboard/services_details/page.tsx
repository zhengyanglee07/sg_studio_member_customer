// src/app/dashboard/services_details/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Carousel, Col, Row, Button } from "antd";
import Image from "next/image";
import "./ServicesPurchase.css";
import { getServiceList } from "@/lib/actions";

const ServicesPurchase: React.FC = () => {
  const router = useRouter();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);

  const slides = [
    "/dashboard/sg-wbs-services1.png",
    "/dashboard/sg-wbs-services2.png",
    "/dashboard/sg-wbs-services3.png",
    "/dashboard/sg-wbs-services4.png",
  ];

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        let data = await getServiceList();
        const customOrder = [2, 1, 0, 3];
        data = customOrder.map((i) => data[i]).filter(Boolean);
        setCategories(data);

      } catch (err) {
        console.error("Error fetching service categories:", err);
      }
    };

    fetchServiceCategories();
  }, []);

  const handleServiceClick = (serviceId: number, alpha: string) => {
    router.push(`/dashboard/services_details/${serviceId}/details?alpha=${alpha}`);
  };

  return (
    <>
      <div id="background"></div>
      <div className="services-purchase-page">
        <h4 className="service-main-title">
          [ SG STUDIO ] -- 專注自然美學，訂製專屬魅力
        </h4>
        <Carousel autoplay className="promo-carousel">
          {slides.map((src, index) => (
            <div key={index} className="carousel-slide">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={360}
                height={180}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </Carousel>

        <Row className="service-category-row" wrap={false}>
          {categories.length > 0 ? (
            categories.map((cat, idx) => (
              <Col key={idx}>
                <div
                  className={`service-category ${activeCategoryIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveCategoryIndex(idx)}
                >
                  <Image
                    src={`/numbering/${idx + 1}.png`}
                    alt={cat.service_category.service_category_name}
                    width={40}
                    height={40}
                    className="service-icon"
                  />
                  <div className="service-text">
                    <div className="service-title">{cat.service_category.service_category_name}</div>
                    <div className="service-subtitle">{cat.service_category.service_category_name_en}</div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
              <Button className="service-type coming-soon-btn" disabled>
                <div className="coming-soon-title">敬請期待 Coming Soon...</div>
              </Button>
            </Col>
          )}
        </Row>

        {categories.length > 0 && categories[activeCategoryIndex] && (
          <>
            <h5 className="category-title">
              {categories[activeCategoryIndex].service_category.service_category_name}
            </h5>
            <Row gutter={[8, 8]} justify="start">
              {categories[activeCategoryIndex].service_detail.length > 0 ? (
                categories[activeCategoryIndex].service_detail.map((service: any, sIdx: number) => (
                  <Col span={8} key={sIdx}>
                    <Button className="service-type" onClick={() => handleServiceClick(service.service_detail_id, String.fromCharCode(97 + sIdx))}>
                      <Image
                        src={`/alphabet/${String.fromCharCode(97 + sIdx)}.png`}
                        alt={service.service_detail_name}
                        width={30}
                        height={30}
                        className="service-type-icon"
                      />
                      <div className="service-type-text">
                        <div className="service-type-title">{service.service_detail_name}</div>
                      </div>
                    </Button>
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button className="service-type coming-soon-btn" disabled>
                    <div className="coming-soon-title">敬請期待 Coming Soon...</div>
                  </Button>
                </Col>
              )}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default ServicesPurchase;
