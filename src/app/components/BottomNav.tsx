// src/app/components/BottomNav.tsx

"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <button
        onClick={() => router.push("/dashboard")}
      >
        <Image
          src={pathname === "/dashboard" ? "/dashboard/menu-02-hover.png" : "/dashboard/menu-02-ori.png"}
          alt="Profile"
          width={52}
          height={52}
          style={{
            paddingBottom: "4px",
          }}
        />
        我的主頁
      </button>
      <button onClick={() => router.push("/dashboard/redemption_item_setting")}>
        <Image
          src={pathname === "/dashboard/redemption_item_setting" ? "/dashboard/menu-03-hover.png" : "/dashboard/menu-03-ori.png"}
          alt="Coupon"
          width={52}
          height={52}
          style={{
            paddingBottom: "4px",
          }}
        />
        禮遇換領
      </button>

      <button
        onClick={() => router.push("/dashboard/referral_program")}
      >
        <Image
          src="/dashboard/referral-program.png"
          alt="Coupon"
          width={72}
          height={72}
          style={{
          }}
        />
      </button>

      <button onClick={() => router.push("/dashboard/services_details")}>
        <Image
          src={pathname === "/dashboard/services_details" ? "/dashboard/menu-04-hover.png" : "/dashboard/menu-04-ori.png"}
          alt="Coin"
          width={52}
          height={52}
          style={{
            paddingBottom: "4px",
          }}
        />
        服務&nbsp;
      </button>
      <button onClick={() => router.push("/dashboard/membership_tier")}>
        <Image
          src={pathname === "/dashboard/membership_tier" ? "/dashboard/menu-01-hover.png" : "/dashboard/menu-01-ori.png"}
          alt="Member"
          width={50}
          height={50}
          style={{
            paddingBottom: "5px",
          }}
        />
        會員計劃
      </button>
    </nav>
  );
}
