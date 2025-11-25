// src/app/dashboard/membership_tier/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import { StarFilled } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getMemberMembershipTierSetting } from "@/lib/actions/member";
import './MembershipTier.css';

const MembershipTierPage: React.FC = () => {
  const [membershipTierData, setMembershipTierData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMembershipTierData();
  }, []);

  const fetchMembershipTierData = async () => {
    try {
      const data = await getMemberMembershipTierSetting();
      setMembershipTierData(data);
    } catch (error) {
      console.error("Error fetching membership tier settings:", error);
    }
  };

  return (
    <>
      <div id="tier-bg"></div>
      <List
        itemLayout="vertical"
        dataSource={membershipTierData}
        id="tierlist"
        renderItem={(item, index) => (
          <List.Item className="tierlist-item">
            <div className="whole-box">
              <div className="icon-half">
                <div className="icon">
                  <Avatar
                    size={60}
                    src={`/dashboard/lvl-b${item.membership_tier_sequence || 1}.png`}
                  />
                </div>
              </div>
              <div className="info-half">
                <div className="title">{item.membership_tier_name}</div>

                {index !== 0 && (
                  <div className="member-benefits">
                    <div className="benefits-title">
                      <StarFilled className="filled-star" />會員專享福利
                    </div>
                    <ul className="benefit-list">
                      {index === 1 && (
                        <li>購物{item.point_multiplier && item.point_multiplier !== 0
                          ? (item.point_multiplier / 1000 ).toFixed(2)
                          : '0.00'}倍積分獎賞</li>
                      )}
                      {index === 2 && (
                        <li>購物{item.point_multiplier && item.point_multiplier !== 0
                          ? (item.point_multiplier / 1000 ).toFixed(2)
                          : '0.00'}倍積分獎賞</li>
                      )}
                      {index === 3 && (
                        <li>購物{item.point_multiplier && item.point_multiplier !== 0
                          ? (item.point_multiplier / 1000 ).toFixed(2)
                          : '0.00'}倍積分獎賞</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="point">
                  &nbsp;所需積分
                  <span className="point-txt">
                    <span className="point-value">
                      &nbsp;<Image src={'/dashboard/point.png'} alt="Point" width={0} height={0} className="tier-point-icon" />
                      &nbsp;{item.require_point}
                    </span>
                  </span>
                </div>
                <div className="maintain-point">
                  &nbsp;續會所需積分
                  <span className="point-txt">
                    <span className="point-value">
                      &nbsp;<Image src={'/dashboard/point.png'} alt="Point" width={0} height={0} className="tier-point-icon" />
                      &nbsp;{item.extend_membership_point}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
      <div style={{ height: '50px', position: 'relative' }}></div>
    </>
  );
};

export default MembershipTierPage;
