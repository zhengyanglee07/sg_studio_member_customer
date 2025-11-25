"use server";

import { apiGet } from "@/lib/api-client";

interface DiscountCode {
  discount_code_id: string;
  discount_code: string;
  discount_code_name: string;
  discount_code_description: string;
  // Add other fields as needed
}

interface DiscountCodeListResponse {
  MemberDiscountCode: DiscountCode[];
  CardData: {
    membership_tier_sequence: number;
    // Add other card data fields
  };
}

export async function getDiscountCodeList(): Promise<DiscountCodeListResponse> {
  try {
    const data = await apiGet<DiscountCodeListResponse>(
      "/customer/member_discount_code/get_member_discount_code_list"
    );
    return data;
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    throw error;
  }
}

export async function getDiscountCodeDetail(
  discountCodeId: string
): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_discount_code/get_member_discount_code_detail/${discountCodeId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching discount code detail:", error);
    throw error;
  }
}

export async function getRedemptionItemRecordList(): Promise<any[]> {
  try {
    const data = await apiGet<any[]>(
      "/customer/member_redemption_item/get_member_redemption_item_record_list"
    );
    return data;
  } catch (error) {
    console.error("Error fetching redemption items:", error);
    throw error;
  }
}

export async function getExpiredRedemptionItemRecordList(): Promise<any[]> {
  try {
    const data = await apiGet<any[]>(
      "/customer/member_redemption_item/get_member_expired_redemption_item_record_list"
    );
    return data;
  } catch (error) {
    console.error("Error fetching expired redemption items:", error);
    throw error;
  }
}
