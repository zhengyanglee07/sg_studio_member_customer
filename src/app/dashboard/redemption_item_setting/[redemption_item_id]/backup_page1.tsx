// 完成取得資料

// 要基本排版


// // src/app/dashboard/redemption_item_setting/[redemption_item_id]/page.tsx

// "use client";

// import React, { useEffect, useState } from "react";
// import withAuth from "../../../components/withAuth";
// import { Card, Avatar, Row, Col, Spin } from "antd";
// import { UserOutlined } from "@ant-design/icons"; // Example icon, you can replace it with your own
// import { useRouter, useParams } from "next/navigation";

// const RedemptionItemDetailPage: React.FC = () => {
//   const [redemptionItemData, setRedemptionItemData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const router = useRouter();
    
//   const params = useParams();
//   const redemption_item_id = params.redemption_item_id;

//   useEffect(() => {
//     if (redemption_item_id) {
//       const fetchRedemptionItemDetails = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/customer/member_redemption_item/get_member_redemption_item_detail/${redemption_item_id}`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               credentials: "include",
//             }
//           );
//           const data = await response.json();
//           setRedemptionItemData(data);
//           setLoading(false);
//         } catch (error) {
//           console.error("Error fetching redemption item details:", error);
//           setLoading(false);
//         }
//       };
//       fetchRedemptionItemDetails();
//     }
//   }, [redemption_item_id]);

//   if (loading) {
//     return <Spin />;
//   }

//   return (
//     <Card>
//       <Row>
//         <Col span={8} style={{ textAlign: "center" }}>
//           <Avatar size={64} icon={<UserOutlined />} />
//           <div>{redemptionItemData?.membership_tier_name}</div>
//         </Col>
//         <Col span={16}>
//           <div style={{ fontSize: "16px", fontWeight: "bold" }}>Redemption Code</div>
//           <div style={{ fontSize: "24px", fontWeight: "bold" }}>{redemptionItemData?.redemption_item}</div>
//           <div style={{ fontSize: "16px" }}>
//             Expiry date: {new Date(redemptionItemData?.expiry_date).toLocaleDateString()}
//           </div>
//         </Col>
//       </Row>
//     </Card>
//   );
// };

// export default withAuth(RedemptionItemDetailPage);