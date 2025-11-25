// 完成底下 Navigation tab, 完成左手邊 Toggle Menu

// 想將 CSS 內容刪除


// "use client";
// import React, { useState } from "react";

// import { Badge, TabBar } from "antd-mobile";
// import {
//   AppOutline,
//   MessageOutline,
//   MessageFill,
//   UnorderedListOutline,
//   UserOutline,
// } from "antd-mobile-icons";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const router = useRouter();
//   const pathname = usePathname();

//   const tabs = [
//     {
//       key: "/dashboard",
//       title: "我的主頁",
//       icon: <AppOutline />,
//       badge: Badge.dot,
//     },
//     {
//       key: "/dashboard/redemption_item",
//       title: "禮遇換領",
//       icon: <UnorderedListOutline />,
//       badge: "5",
//     },
//     {
//       key: "/dashboard/member_order",
//       title: "消費記錄",
//       icon: (active: boolean) =>
//         active ? <MessageFill /> : <MessageOutline />,
//       badge: "99+",
//     },
//     {
//       key: "/dashboard/membership_tier",
//       title: "會員計劃",
//       icon: <UserOutline />,
//     },
//   ];

//   return (
//     <>
//       <style jsx>{`
//         .dashboard {
//           display: flex;
//           flex-direction: column;
//           min-height: 100vh;
//         }
//         .header {
//           display: flex;
//           align-items: center;
//           padding: 1rem;
//           background-color: #f8f9fa;
//         }
//         .menu-button {
//           font-size: 1.5rem;
//           background: none;
//           border: none;
//           margin-right: 1rem;
//         }
//         .header h1 {
//           font-size: 1.25rem;
//         }
//         .settings-menu {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 75%;
//           max-width: 300px;
//           height: 100%;
//           background-color: #fff;
//           box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
//           z-index: 1000;
//           transform: translateX(${isMenuOpen ? "0" : "-100%"});
//           transition: transform 0.3s ease-in-out;
//         }
//         .settings-menu ul {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }
//         .settings-menu li {
//           padding: 1rem;
//           border-bottom: 1px solid #ddd;
//         }
//         .bottom-nav {
//           display: flex;
//           justify-content: space-around;
//           padding: 0.5rem;
//           background-color: #f8f9fa;
//           position: fixed;
//           bottom: 0;
//           width: 100%;
//         }
//         .bottom-nav button {
//           flex: 1;
//           padding: 0.5rem;
//           background: none;
//           border: none;
//           font-size: 1rem;
//         }
//         /* Responsive styles */
//         @media (min-width: 600px) {
//           .header h1 {
//             font-size: 1.5rem;
//           }
//           .bottom-nav button {
//             font-size: 1.25rem;
//           }
//         }
//       `}</style>

//       <header className="header">
//         <button className="menu-button" onClick={toggleMenu}>
//           ☰
//         </button>
//         <h1>Welcome back, {"customerName"}!</h1>
//       </header>

//       {isMenuOpen && (
//         <div className="settings-menu">
//           <button className="close-button" onClick={closeMenu}>
//             ✕
//           </button>
//           <ul>
//             <li>
//               <Link href="/settings/profile">Profile</Link>
//             </li>
//             <li>
//               <Link href="/settings/account">Account</Link>
//             </li>
//             <li>
//               <Link href="/settings/privacy">Privacy</Link>
//             </li>
//             <li>
//               <Link href="/settings/help">Help</Link>
//             </li>
//           </ul>
//         </div>
//       )}
//       {children}
//       <TabBar
//         activeKey={pathname}
//         onChange={(key) => {
//           router.push(key);
//         }}
//         style={{ position: "fixed", bottom: 0, width: "100%" }}
//       >
//         {tabs.map((item) => (
//           <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
//         ))}
//       </TabBar>
//     </>
//   );
// }
