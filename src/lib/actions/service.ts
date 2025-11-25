"use server";

import { apiGet } from "@/lib/api-client";

interface ServiceCategory {
  service_category: {
    service_category_name: string;
    service_category_name_en: string;
  };
  service_detail: ServiceDetail[];
}

interface ServiceDetail {
  service_detail_id: number;
  service_detail_name: string;
}

export async function getServiceList(): Promise<ServiceCategory[]> {
  try {
    const data = await apiGet<ServiceCategory[]>(
      "/customer/member_product/get_service_list"
    );
    return data;
  } catch (err) {
    console.error("Error fetching service categories:", err);
    throw err;
  }
}

interface ServiceDetailInfo {
  service_detail_id: number;
  service_detail_name: string;
  service_detail_description: string;
  // Add other fields as needed based on your API response
}

export async function getServiceDetail(
  serviceDetailId: number
): Promise<ServiceDetailInfo> {
  try {
    const data = await apiGet<ServiceDetailInfo>(
      `/customer/member_product/get_service_detail/${serviceDetailId}`
    );
    return data;
  } catch (err) {
    console.error("Error fetching service detail:", err);
    throw err;
  }
}
