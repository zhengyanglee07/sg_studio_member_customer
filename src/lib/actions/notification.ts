"use server";

import { apiPost } from "@/lib/api-client";

interface SubscribeResponse {
  success: boolean;
  message?: string;
}

export async function subscribeToPushNotification(
  subscription: string
): Promise<SubscribeResponse> {
  try {
    await apiPost<void>(
      "/customer/member_notification/subscribe",
      JSON.parse(subscription)
    );
    return { success: true };
  } catch (error) {
    console.error("Push notification subscription error:", error);
    return { success: false, message: "Failed to subscribe" };
  }
}

export async function unsubscribeFromPushNotification(
  subscription: string
): Promise<SubscribeResponse> {
  try {
    await apiPost<void>(
      "/customer/member_notification/unsubscribe",
      JSON.parse(subscription)
    );
    return { success: true };
  } catch (error) {
    console.error("Push notification unsubscription error:", error);
    return { success: false, message: "Failed to unsubscribe" };
  }
}
