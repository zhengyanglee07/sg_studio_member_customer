// src/app/components/DashboardHeader.tsx

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SideMenu from "./SideMenu";

interface DashboardHeaderProps {
  memberName: string;
  memberPhone: string;
  tierId: number | null;
  tierName: string;
  tierSequence: number;
}

export default function DashboardHeader({
  memberName,
  memberPhone,
  tierId,
  tierName,
  tierSequence,
}: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const titleMap: Record<string, string> = {
    "/dashboard": `歡迎回來，${memberName}！`,
    "/dashboard/services_details": "服務  ",
    "/dashboard/redemption_item_setting": "禮遇換領 ",
    "/dashboard/membership_tier": "會員計劃 ",
    "/dashboard/referral_program": "推薦計劃 ",
  };

  const getTitleFromPath = (path: string): string => {
    return titleMap[path];
  };

  return (
    <>
      <header className="header">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <h1>{getTitleFromPath(pathname)} </h1>
      </header>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        memberName={memberName}
        memberPhone={memberPhone}
        tierId={tierId}
        tierName={tierName}
        tierSequence={tierSequence}
      />
    </>
  );
}
