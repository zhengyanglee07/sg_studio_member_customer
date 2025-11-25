"use server";

import { apiGet, apiPost } from "@/lib/api-client";

interface RedemptionItem {
  redemption_item_id: string;
  redemption_item_name: string;
  redemption_item_description: string;
  points_required: number;
  minimum_membership_tier_sequence: number;
  minimum_membership_tier_id: number;
  minimum_membership_tier_name: string;
  has_redeemed: boolean;
  redeem_count_limit: string;
}

interface RedemptionItemSettingResponse {
  CardData: {
    membership_tier_sequence: number;
  };
  RedemptionItems: RedemptionItem[];
}

export async function getRedemptionItemSetting(): Promise<RedemptionItemSettingResponse> {
  try {
    const data = await apiGet<RedemptionItemSettingResponse>(
      "/customer/member_redemption_item/get_member_redemption_item_setting"
    );
    return data;
  } catch (error) {
    console.error("Error fetching redemption items:", error);
    throw error;
  }
}

interface RedemptionItemDetail {
  redemption_item_id: string;
  redemption_item_name: string;
  redemption_item_description: string;
  points_required: number;
  minimum_membership_tier_sequence: number;
  minimum_membership_tier_id: number;
  minimum_membership_tier_name: string;
  has_redeemed: boolean;
  redeem_count_limit: string;
}

export async function getRedemptionItemDetail(
  redemptionItemId: string
): Promise<RedemptionItemDetail> {
  try {
    const data = await apiGet<RedemptionItemDetail>(
      `/customer/member_redemption_item/get_member_redemption_item_setting_detail/${redemptionItemId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching redemption item details:", error);
    throw error;
  }
}

interface RedeemItemPayload {
  redemption_item_id: string;
}

interface RedeemItemResponse {
  success: boolean;
  message?: string;
}

export async function redeemItem(
  payload: RedeemItemPayload
): Promise<RedeemItemResponse> {
  try {
    await apiPost<void>(
      "/customer/member_redemption_item/post_member_redemption_item_redeem",
      payload
    );
    return { success: true };
  } catch (error: any) {
    console.error("Error redeeming item:", error);
    return {
      success: false,
      message: error.message || "An error occurred while redeeming the item",
    };
  }
}

export async function getRedemptionRecord(
  redemptionRecordId: string
): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_redemption_item/get_member_redemption_record/${redemptionRecordId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching redemption record:", error);
    throw error;
  }
}

export async function getRedemptionItemRecordDetail(
  redemptionRecordId: string
): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_redemption_item/get_member_redemption_item_record_detail/${redemptionRecordId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching redemption item record detail:", error);
    throw error;
  }
}

export async function getExpiredRedemptionRecord(
  expiredRedemptionRecordId: string
): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_redemption_item/get_member_expired_redemption_record/${expiredRedemptionRecordId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching expired redemption record:", error);
    throw error;
  }
}

export async function getExpiredRedemptionItemRecordDetail(
  expiredRedemptionRecordId: string
): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_redemption_item/get_member_expired_redemption_item_record_detail/${expiredRedemptionRecordId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching expired redemption item record detail:", error);
    throw error;
  }
}
