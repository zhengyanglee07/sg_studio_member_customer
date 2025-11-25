"use server";

import { cookies } from "next/headers";
import { apiPost } from "@/lib/api-client";

interface LoginCredentials {
  member_phone: string;
  member_password: string;
  dial_code: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  tokenExpiry?: number;
  error?: string;
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const tenantHost = process.env.NEXT_PUBLIC_TENANT_HOST || "default";

  try {
    const data = await apiPost<any>(
      "/customer/customer_auth/login",
      credentials,
      { includeAuth: false }
    );

    if (data.success && data.data?.token) {
      const cookieStore = cookies();
      cookieStore.set({
        name: `${tenantHost}_m_token`,
        value: data.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.data.tokenExpiry || 7 * 24 * 60 * 60,
      });

      cookieStore.set({
        name: `${tenantHost}_dial_code`,
        value: credentials.dial_code,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.data.tokenExpiry || 7 * 24 * 60 * 60,
      });

      console.log("✅ Login successful, cookies set");
      return {
        success: true,
        token: data.token,
        tokenExpiry: data.tokenExpiry,
      };
    } else {
      return { success: false, error: data.error || "登入失敗，請再試一次" };
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    return { success: false, error: "伺服器錯誤，請稍後再試" };
  }
}

interface CheckReferrerPayload {
  mode: "check_referrer";
  referrer_input: string;
  referrer_dial_code?: string;
}

interface CheckReferrerResponse {
  exists: boolean;
}

export async function checkReferrer(
  input: string,
  mode: "phone" | "code",
  referralDialCode?: string
): Promise<CheckReferrerResponse> {
  if (!input) {
    return { exists: true };
  }

  try {
    const payload: CheckReferrerPayload = {
      mode: "check_referrer",
      referrer_input: input,
    };

    if (mode === "phone" && referralDialCode) {
      payload.referrer_dial_code = referralDialCode;
    }

    const data = await apiPost<any>(
      "/customer/customer_auth/check_referrer",
      payload,
      { includeAuth: false }
    );
    return { exists: data.exists };
  } catch (err) {
    console.error("Referrer check failed", err);
    return { exists: false };
  }
}

interface SignupPayload {
  member_name: string;
  member_birthday: string;
  member_phone: string;
  member_password: string;
  dial_code: string;
  tenant_host?: string;
  membi_customer_secret?: string;
  referrer_phone?: string;
  referrer_dial_code?: string;
  referrer_referral_code?: string;
}

interface SignupResponse {
  success: boolean;
  sms_result: {
    success: boolean;
    message?: string;
  };
  error?: string;
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  try {
    const data = await apiPost<SignupResponse>(
      "/customer/customer_auth/signup",
      payload,
      { includeAuth: false }
    );
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      sms_result: { success: false, message: "無法註冊，請稍後再試" },
    };
  }
}

interface VerifyOTPPayload {
  verificationCode: string;
  member_phone: string;
  dial_code: string;
}

interface VerifyOTPResponse {
  status: string;
  message?: string;
}

export async function verifyOTP(payload: VerifyOTPPayload): Promise<VerifyOTPResponse> {
  try {
    const data = await apiPost<VerifyOTPResponse>(
      "/customer/customer_auth/verification",
      payload,
      { includeAuth: false }
    );
    return data;
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      status: "fail",
      message: "無法驗證您的身份，請稍後再嘗試",
    };
  }
}
