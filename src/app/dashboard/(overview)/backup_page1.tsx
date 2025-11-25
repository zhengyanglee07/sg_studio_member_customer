// 完成可以順利拎到數據

// 想試試 Card 的版面是否能夠修改

// // src/app/dashboard/(overview)/page.tsx

// "use client";

// import React, { useContext, useEffect, useState } from "react";
// import withAuth from "../../components/withAuth";
// import { Card, Tabs, List, Avatar, Button } from "antd";

// const data = [
//   {
//     title: "Ant Design Title 1",
//   },
//   {
//     title: "Ant Design Title 2",
//   },
//   {
//     title: "Ant Design Title 3",
//   },
//   {
//     title: "Ant Design Title 4",
//   },
// ];

// const DashboardPage: React.FC = () => {
//   const [cardData, setCardData] = useState<any>(null);
//   const [tabKey, setTabKey] = useState<string>("activity");
//   const [listData, setListData] = useState<any[]>([]);

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
//         console.log(data); // 查看後端數據結構
//         setCardData(data);
//       } catch (error) {
//         console.error("Error fetching card data:", error);
//       }
//     };
//     fetchDashboardCard();

//     // Fetch initial list data for "activity"
//     fetchListData("activity");
//   }, []);

//   const fetchListData = async (key: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customer/member_member/get_list_data?type=${key}`,
//         {
//           credentials: "include",
//         }
//       );
//       const data = await response.json();
//       setListData(data);
//     } catch (error) {
//       console.error("Error fetching list data:", error);
//     }
//   };

//   const handleTabChange = (key: string) => {
//     setTabKey(key);
//     fetchListData(key);
//   };

//   return (
//     <>
//       <Card title={cardData?.membership_tier_name}>{cardData?.membership_expiry_date}</Card>

//       <Tabs activeKey={tabKey} onChange={handleTabChange}>
//         <Tabs.TabPane tab="Activity" key="activity" />
//         <Tabs.TabPane tab="My Coupon" key="my-coupon" />
//         <Tabs.TabPane tab="Expired Coupon" key="expired-coupon" />
//       </Tabs>

//       <List
//         itemLayout="vertical"
//         dataSource={listData}
//         renderItem={(item) => (
//           <List.Item extra={<Button type="primary">Details</Button>}>
//             <List.Item.Meta
//               avatar={<Avatar size={64} src={item.icon} />}
//               title={item.title}
//               description={item.description}
//             />
//           </List.Item>
//         )}
//       />
//     </>
//   );
// };

// // export default DashboardPage;
// export default withAuth(DashboardPage);
