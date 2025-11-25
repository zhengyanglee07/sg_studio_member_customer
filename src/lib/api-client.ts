"use server";

import { cookies } from "next/headers";

interface ApiClientOptions extends RequestInit {
  endpoint: string;
  includeAuth?: boolean;
  headers?: HeadersInit;
}

class APIFetchError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, APIFetchError.prototype);
  }
}

/**
 * Server-side API client with automatic Authorization header from cookies
 */
export async function apiClient<T = unknown>({
  endpoint,
  includeAuth = true,
  headers,
  ...options
}: ApiClientOptions): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get(`${process.env.NEXT_PUBLIC_TENANT_HOST}_m_token`);

  const customHeader = new Headers(headers || {});

  customHeader.set("Content-Type", "application/json");

  if (includeAuth && token) {
    customHeader.set("Authorization", `Bearer ${token.value}`);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers: customHeader,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "❌ API Fetch Error",
      response.status,
      response.statusText,
      data,
    );

    // Redirect to login if unauthorized
    // console.log(
    //   "Checking for 401 status to redirect to login",
    //   response.status,
    //   data?.error,
    // );
    // if (
    //   response.status === 401 &&
    //   ["Unauthorized", "Invalid token"].includes(data?.error)
    // ) {
    //   redirect("/login");
    // }

    throw new APIFetchError(
      `Failed to fetch data: Status ${response.status} ${options.method} ${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    );
  }

  return data;
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  options?: Omit<ApiClientOptions, "endpoint" | "method">,
): Promise<T> {
  return apiClient<T>({ endpoint, method: "GET", ...options });
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiClientOptions, "endpoint" | "method" | "body">,
): Promise<T> {
  return apiClient<T>({
    endpoint,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiClientOptions, "endpoint" | "method" | "body">,
): Promise<T> {
  return apiClient<T>({
    endpoint,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  options?: Omit<ApiClientOptions, "endpoint" | "method">,
): Promise<T> {
  return apiClient<T>({ endpoint, method: "DELETE", ...options });
}

/**
 * Get the current admin token from cookies
 */
export async function getAdminToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(`${process.env.TENANT_HOST}_admin_token`);
  return token?.value;
}
