"use server";

import { apiGet, apiPut } from "@/lib/api-client";

interface MemberDashboardCard {
  member_name: string;
  member_id: number;
  member_phone: string;
  membership_tier_id: number;
  membership_tier_name: string;
  membership_tier_sequence: number;
}

export async function getMemberDashboardCard(): Promise<MemberDashboardCard> {
  try {
    const data = await apiGet<MemberDashboardCard>(
      "/customer/member_member/get_member_dashboard_card"
    );
    return data;
  } catch (error) {
    console.error("Error fetching member dashboard card:", error);
    throw error;
  }
}

interface MemberProfileDetail {
  member_name: string;
  member_phone: string;
  birthday: string;
  points_balance: number;
  membership_tier_name: string;
  membership_tier_sequence: number;
  total_order: number;
  created_at: string;
  membership_expiry_date: string;
}

export async function getMemberProfileDetail(): Promise<MemberProfileDetail> {
  try {
    const data = await apiGet<MemberProfileDetail>(
      "/customer/member_member/get_member_profile_detail"
    );
    return data;
  } catch (error) {
    console.error("Error fetching member profile detail:", error);
    throw error;
  }
}

interface UpdateProfilePayload {
  member_name: string;
  birthday: string | null;
  current_password?: string;
  new_password?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
}

export async function updateMemberProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  try {
    await apiPut<void>(
      "/customer/member_member/put_member_update_profile_detail",
      payload
    );
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error.message || "An error occurred while updating the profile.",
    };
  }
}

interface MemberReferralDetail {
  referral_code: string;
  member_phone: string;
  points_per_referral: number;
  total_points_earn_by_referral: number;
  referral_count: number;
}

export async function getMemberReferralDetail(): Promise<MemberReferralDetail> {
  try {
    const data = await apiGet<MemberReferralDetail>(
      "/customer/member_member/get_member_referral_detail"
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch referral summary:", err);
    throw err;
  }
}

interface MembershipTierSetting {
  membership_tier_id: number;
  membership_tier_name: string;
  membership_tier_sequence: number;
  require_point: number;
  extend_membership_point: number;
  point_multiplier: number;
}

export async function getMemberMembershipTierSetting(): Promise<MembershipTierSetting[]> {
  try {
    const data = await apiGet<MembershipTierSetting[]>(
      "/customer/member_membership_tier/get_member_membership_tier_setting"
    );
    return data;
  } catch (error) {
    console.error("Error fetching membership tier settings:", error);
    throw error;
  }
}
