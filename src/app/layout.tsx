// src/app/layout.tsx
import React, { useEffect, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyledComponentsRegistry from "./registry";
import "../styles/global.css";
import { IBM_Plex_Serif } from "next/font/google";
import { ConfigProvider } from "antd";
import { PostHogProvider } from "./posthog-provider";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  appleWebApp: {
    title: "SG Studio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={ibmPlexSerif.className}>
        <PostHogProvider>
          <StyledComponentsRegistry>
            <AntdRegistry>
              <ConfigProvider
                theme={{ token: { fontFamily: ibmPlexSerif.style.fontFamily } }}
              >
                {/* <div className="container"> */}
                {children}
                {/* </div> */}
              </ConfigProvider>
            </AntdRegistry>
          </StyledComponentsRegistry>
        </PostHogProvider>
      </body>
    </html>
  );
}

