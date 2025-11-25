"use server";

interface CountryInfo {
  country_code: string;
  country_name?: string;
}

/**
 * Get user's country code based on their IP address
 * Returns lowercase country code (e.g., "tw", "hk", "us")
 */
export async function getCountryFromIP(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json");
    const data: CountryInfo = await response.json();
    return data.country_code.toLowerCase();
  } catch (error) {
    console.error("Error fetching country from IP:", error);
    // Return default country code if API fails
    return "tw";
  }
}
