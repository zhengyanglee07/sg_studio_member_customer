"use server";

import { apiGet } from "@/lib/api-client";

interface MemberOrderCard {
  count_member_order: number;
  // Add other fields as needed based on your API response
}

export async function getMemberOrderCard(): Promise<MemberOrderCard> {
  try {
    const data = await apiGet<MemberOrderCard>(
      "/customer/member_member_order/get_member_member_order_card"
    );
    return data;
  } catch (error) {
    console.error("Error fetching member order card:", error);
    throw error;
  }
}

export async function getMemberOrderList(): Promise<any[]> {
  try {
    const data = await apiGet<any[]>(
      "/customer/member_member_order/get_member_member_order_list"
    );
    return data;
  } catch (error) {
    console.error("Error fetching member order list:", error);
    throw error;
  }
}

export async function getMemberOrderDetail(orderId: string): Promise<any> {
  try {
    const data = await apiGet<any>(
      `/customer/member_member_order/get_member_member_order_detail/${orderId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching member order detail:", error);
    throw error;
  }
}
