// 完成卡片部份
// 完成 tabs 分頁, 及 fetch data 部份
// 但 Redemption item 及 expired Redemption item 功能未完成，要完成咗 Redemption item page先




// // src/app/dashboard/(overview)/page.tsx

// "use client";

// import React, { useEffect, useState } from "react";
// import withAuth from "../../components/withAuth";
// import { Card, Tabs, List, Avatar, Button, Row, Col } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { useRouter } from "next/navigation";

// const DashboardPage: React.FC = () => {
//   const [cardData, setCardData] = useState<any>(null);
//   const [tabKey, setTabKey] = useState<string>("discount_codes");

//   // Separate state variables for each list
//   const [discountCodesData, setDiscountCodesData] = useState<any[]>([]);
//   const [redemptionItemsData, setRedemptionItemsData] = useState<any[]>([]);
//   const [expiredRedemptionItemsData, setExpiredRedemptionItemsData] = useState<any[]>([]);

//   const router = useRouter();

//   useEffect(() => {
//     // Fetch card data
//     const fetchDashboardCard = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member/get_member_dashboard_card`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           }
//         );
//         const data = await response.json();
//         setCardData(data);
//       } catch (error) {
//         console.error("Error fetching card data:", error);
//       }
//     };
//     fetchDashboardCard();

//     // Fetch data for all lists
//     fetchDiscountCodesData();
//     // fetchRedemptionItemsData();
//     // fetchExpiredRedemptionItemsData();
//   }, []);

//   // Separate fetch functions for each list
//   const fetchDiscountCodesData = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customer/member_discount_code/get_member_discount_code_list`,
//         {
//           credentials: "include",
//         }
//       );
//       const data = await response.json();
//       setDiscountCodesData(data);
//     } catch (error) {
//       console.error("Error fetching discount codes:", error);
//     }
//   };

//   const fetchRedemptionItemsData = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customer/member_redemption_item/get_member_redemption_item_redeem_list`,
//         {
//           credentials: "include",
//         }
//       );
//       const data = await response.json();
//       setRedemptionItemsData(data);
//     } catch (error) {
//       console.error("Error fetching redemption items:", error);
//     }
//   };

//   const fetchExpiredRedemptionItemsData = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customer/member_redemption_item/get_expired_member_redemption_item_redeem_list`,
//         {
//           credentials: "include",
//         }
//       );
//       const data = await response.json();
//       setExpiredRedemptionItemsData(data);
//     } catch (error) {
//       console.error("Error fetching expired redemption items:", error);
//     }
//   };

//   const handleTabChange = (key: string) => {
//     setTabKey(key);

//     // Optionally fetch data on tab change
//     if (key === "discount_codes") {
//       fetchDiscountCodesData();
//     } else if (key === "redemption_items") {
//       fetchRedemptionItemsData();
//     } else if (key === "expired_redemption_items") {
//       fetchExpiredRedemptionItemsData();
//     }
//   };

//   // Separate handle click functions
//   const handleDiscountCodeClick = (discountCodeId: string) => {
//     router.push(`/dashboard/discount_code/${discountCodeId}`);
//   };

//   const handleRedemptionItemClick = (redemptionItemId: string) => {
//     router.push(`/dashboard/redemption_item/${redemptionItemId}`);
//   };

//   const handleExpiredRedemptionItemClick = (redemptionItemId: string) => {
//     router.push(`/dashboard/expired_redemption_item/${redemptionItemId}`);
//   };

//   return (
//     <>
//       <Card>
//         <Row>
//           <Col span={8} style={{ textAlign: "center" }}>
//             <Avatar size={64} icon={<UserOutlined />} />
//             <div>{cardData?.membership_tier_name}</div>
//           </Col>
//           <Col span={16}>
//             <div style={{ fontSize: "16px", fontWeight: "bold" }}>Points can use</div>
//             <div style={{ fontSize: "24px", fontWeight: "bold" }}>{cardData?.point}</div>
//             <div style={{ fontSize: "16px" }}>
//               Expiry date:{" "}
//               {cardData?.membership_expiry_date
//                 ? new Date(cardData.membership_expiry_date).toLocaleDateString()
//                 : ""}
//             </div>
//           </Col>
//         </Row>
//       </Card>

//       <Tabs activeKey={tabKey} onChange={handleTabChange}>
//         <Tabs.TabPane tab="Discount Codes" key="discount_codes" />
//         <Tabs.TabPane tab="Redemption Items" key="redemption_items" />
//         <Tabs.TabPane tab="Expired Redemption Items" key="expired_redemption_items" />
//       </Tabs>

//       {tabKey === "discount_codes" && (
//         <List
//           itemLayout="vertical"
//           dataSource={discountCodesData}
//           renderItem={(item) => (
//             <List.Item
//               extra={
//                 <Button
//                   type="primary"
//                   onClick={() => handleDiscountCodeClick(item.discount_code_id)}
//                 >
//                   Details
//                 </Button>
//               }
//             >
//               <List.Item.Meta
//                 avatar={<Avatar size={64} src={item.icon} />}
//                 title={item.discount_code_name}
//                 description={item.valid_until}
//               />
//             </List.Item>
//           )}
//         />
//       )}

//       {tabKey === "redemption_items" && (
//         <List
//           itemLayout="vertical"
//           // dataSource={redemptionItemsData}
//           dataSource={discountCodesData}
          
//           renderItem={(item) => (
//             <List.Item
//               extra={
//                 <Button
//                   type="primary"
//                   onClick={() => handleRedemptionItemClick(item.redemption_item_id)}
//                 >
//                   Details
//                 </Button>
//               }
//             >
//               <List.Item.Meta
//                 avatar={<Avatar size={64} src={item.icon} />}
//                 // title={item.redemption_item_name}
//                 title={item.discount_code_name}
//                 description={item.valid_until}
//               />
//             </List.Item>
//           )}
//         />
//       )}

//       {tabKey === "expired_redemption_items" && (
//         <List
//           itemLayout="vertical"
//           // dataSource={expiredRedemptionItemsData}
//           dataSource={discountCodesData}
//           renderItem={(item) => (
//             <List.Item
//               extra={
//                 <Button
//                   type="primary"
//                   onClick={() => handleExpiredRedemptionItemClick(item.redemption_item_id)}
//                 >
//                   Details
//                 </Button>
//               }
//             >
//               <List.Item.Meta
//                 avatar={<Avatar size={64} src={item.icon} />}
//                 // title={item.redemption_item_name}
//                 title={item.discount_code_name}
//                 description={item.valid_until}
//               />
//             </List.Item>
//           )}
//         />
//       )}
//     </>
//   );
// };

// export default withAuth(DashboardPage);