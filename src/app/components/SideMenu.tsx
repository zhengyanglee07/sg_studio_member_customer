// src/app/components/SideMenu.tsx

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import QRCodeStyling from "qr-code-styling";
import LogoutButton from "./LogoutButton";
import {
  LinkOutlined,
  SettingOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberPhone: string;
  tierId: number | null;
  tierName: string;
  tierSequence: number;
}

export default function SideMenu({
  isOpen,
  onClose,
  memberName,
  memberPhone,
  tierId,
  tierName,
  tierSequence,
}: SideMenuProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!memberPhone || !qrRef.current || !isOpen) return;

    qrRef.current.innerHTML = "";

    if (!qrInstance.current) {
      qrInstance.current = new QRCodeStyling({
        width: 200,
        height: 200,
        data: memberPhone,
        dotsOptions: { color: "#FFFFFF", type: "rounded" },
        backgroundOptions: { color: "transparent" },
      });
    } else {
      qrInstance.current.update({ data: memberPhone });
    }

    qrInstance.current.append(qrRef.current);
  }, [memberPhone, isOpen]);

  return (
    <>
      {isOpen && (
        <div className="menu-overlay" onClick={onClose}></div>
      )}

      <div className={`settings-menu ${isOpen ? 'open' : ''}`}>
        <Image
          src="/white-sg-studio-logo.png"
          alt="Icon"
          width={80}
          height={80}
          style={{
            objectFit: 'contain',
          }}
          className="slide-menu-logo"
        />
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <li id="profile">
          <div style={{ paddingBottom: "8px" }}>
            <div ref={qrRef} style={{ width: 200, height: 200 }} />
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              letterSpacing: "4px",
            }}
          >
            ID: {memberPhone ?? "載入中..."}
          </span>
          &nbsp;

          <a
            href="/profile"
            style={{
              width: "255px",
              display: "flex",
              alignItems: "center",
              paddingTop: "8px",
            }}
            className="profile-info"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: "5px",
                }}
              >
                <Image
                  src={`/dashboard/lvl${tierSequence}.png`}
                  alt={`Level ${tierSequence}`}
                  width={20}
                  height={20}
                />
                <p
                  style={{
                    margin: "0px",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {tierName || "等級載入中..."}
                </p>
              </div>
              <span
                style={{
                  margin: "0px",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                &nbsp;{memberName}
              </span>
            </div>
            <SettingOutlined
              style={{ fontSize: "30px", color: "white" }}
            />
          </a>
        </li>

        <div className="menu">
          <ul className="menu-top">
            <li>
              <a href="https://sgstudio-hk.com/" target="_blank" rel="noopener noreferrer">
                <div className="link-with-icon">
                  官方網站
                  <LinkOutlined
                    style={{ color: "#2989C5", fontSize: "20px" }}
                  />
                </div>
              </a>
            </li>
            <li>
              <a href="https://api.whatsapp.com/send/?phone=85256805775&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                <div className="link-with-icon">
                  聯絡我們
                  <WhatsAppOutlined
                    style={{ color: "#62A02B", fontSize: "20px" }}
                  />
                </div>
              </a>
            </li>
          </ul>
          <ul className="menu-bottom">
            <li>
              <div className="link-with-icon">
                <LogoutButton />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
