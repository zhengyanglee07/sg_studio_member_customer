// Export all server actions from a single entry point

// Auth actions
export {
  loginUser,
  checkReferrer,
  signupUser,
  verifyOTP,
} from "./auth";

// Member actions
export {
  getMemberDashboardCard,
  getMemberProfileDetail,
  updateMemberProfile,
  getMemberReferralDetail,
} from "./member";

// Notification actions
export {
  subscribeToPushNotification,
  unsubscribeFromPushNotification,
} from "./notification";

// Service actions
export {
  getServiceList,
  getServiceDetail,
} from "./service";

// Redemption actions
export {
  getRedemptionItemSetting,
  getRedemptionItemDetail,
  redeemItem,
  getRedemptionRecord,
  getRedemptionItemRecordDetail,
  getExpiredRedemptionRecord,
  getExpiredRedemptionItemRecordDetail,
} from "./redemption";

// Order actions
export {
  getMemberOrderCard,
  getMemberOrderList,
  getMemberOrderDetail,
} from "./order";

// Discount actions
export {
  getDiscountCodeList,
  getDiscountCodeDetail,
  getRedemptionItemRecordList,
  getExpiredRedemptionItemRecordList,
} from "./discount";

// Utility actions
export {
  getCountryFromIP,
} from "./utils";
