// src/app/dashboard/layout.tsx

import React from "react";
import PushSetupClient from "../components/PushSetupClient";
import DashboardHeader from "../components/DashboardHeader";
import BottomNav from "../components/BottomNav";
import { getMemberDashboardCard } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch member data on the server
  const data = await getMemberDashboardCard();

  return (
    <>
      <PushSetupClient />

      <DashboardHeader
        memberName={data.member_name}
        memberPhone={data.member_phone}
        tierId={data.membership_tier_id}
        tierName={data.membership_tier_name}
        tierSequence={data.membership_tier_sequence ?? 1}
      />

      <main className="children-content">{children}</main>

      <BottomNav />
    </>
  );
}
