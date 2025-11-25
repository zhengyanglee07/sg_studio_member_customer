// src/app/components/PushSetupClient.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import {
  subscribeToPushNotification,
  unsubscribeFromPushNotification,
} from "@/lib/actions";

const IOSShareIcon = () => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="0.5"
    fill="#000000"
    className="bi bi-box-arrow-up"
  >
    <path
      fillRule="evenodd"
      d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
    />
    <path
      fillRule="evenodd"
      d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"
    />
  </svg>
);

const AddToHomeScreenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <line x1="15.5" y1="12" x2="8.5" y2="12" />
    <line x1="12" y1="15.5" x2="12" y2="8.5" />
  </svg>
);

const AndroidAddToHomeScreenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    style={{ verticalAlign: "middle" }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1D1D1D"
      d="M407.28,0.23L174.54,0C148.93,0,128,20.94,128,46.54v69.82h46.55V93.08h232.73v325.83H174.54v-23.27H128v69.82
      c0,25.61,20.93,46.55,46.55,46.55h232.73c25.59,0,46.55-20.93,46.55-46.55V46.54C453.82,20.94,432.87,0.23,407.28,0.23z
      M221.09,325.81h46.55V162.9H104.72v46.55h83.55L58.18,339.56L91,372.36l130.09-130.09V325.81z"
    />
  </svg>
);

export default function PushSetupClient() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [installModalVisible, setInstallModalVisible] = useState(false);
  const [addToHomeModalVisible, setAddToHomeModalVisible] = useState(false);
  const [addToHomeModalVisibleAndroid, setAddToHomeModalVisibleAndroid] =
    useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [neverRemindInstall, setNeverRemindInstall] = useState(false);
  const [neverRemindAddToHome, setNeverRemindAddToHome] = useState(false);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }

    const storedSub = localStorage.getItem("pushSubscription");
    if (storedSub) setIsSubscribed(true);

    // Check never remind preferences
    const neverRemindInstallPref =
      localStorage.getItem("neverRemindInstall") === "true";
    const neverRemindAddToHomePref =
      localStorage.getItem("neverRemindAddToHome") === "true";
    setNeverRemindInstall(neverRemindInstallPref);
    setNeverRemindAddToHome(neverRemindAddToHomePref);

    const isFakeIOS =
      navigator.platform === "Win32" && /iPhone/.test(navigator.userAgent);

    const isIOSDetected = (() => {
      const ua = navigator.userAgent || navigator.vendor;
      const iOSRegex = /iPad|iPhone|iPod/i;
      const isTouchMac =
        navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
      const detected = iOSRegex.test(ua) || isTouchMac;
      return detected && !isFakeIOS;
    })();

    setIsIOS(isIOSDetected);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    const fakeMemberId = "abc123";
    setMemberId(fakeMemberId);
    if (
      standalone &&
      !storedSub &&
      pathname === "/dashboard" &&
      !neverRemindInstallPref
    ) {
      setInstallModalVisible(true);
    }

    if (isIOSDetected && !standalone && !neverRemindAddToHomePref) {
      setAddToHomeModalVisible(true);
    } else if (!isIOSDetected && !standalone && !neverRemindAddToHomePref) {
      setAddToHomeModalVisibleAndroid(true);
    }
  }, [pathname]);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const storedSub = localStorage.getItem("pushSubscription");

    if (standalone && !storedSub && !isIOS) {
      setShowSubscribePrompt(true);
    }
  }, [isIOS]);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  const subscribeToPush = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(sub);
    const subString = JSON.stringify(sub);
    localStorage.setItem("pushSubscription", subString);
    const result = await subscribeToPushNotification(subString);
    if (!result.success) {
      alert(result.message || "Failed to subscribe on the server");
    }
    console.log("Push subscription:", sub);
  }, []);

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    localStorage.removeItem("pushSubscription");
    const storedSub = localStorage.getItem("pushSubscription");
    if (!storedSub) return;
    const result = await unsubscribeFromPushNotification(storedSub);
    if (!result.success) {
      alert(result.message || "Failed to unsubscribe on the server");
    }
    console.log("Unsubscribed from push notifications");
  }

  const handleSubscribe = useCallback(async () => {
    console.log("Subscribing to push notifications...");
    await subscribeToPush();
    setIsSubscribed(true);
  }, [subscribeToPush]);

  const handleNeverRemindInstall = () => {
    localStorage.setItem("neverRemindInstall", "true");
    setNeverRemindInstall(true);
    setInstallModalVisible(false);
  };

  const handleNeverRemindAddToHome = () => {
    localStorage.setItem("neverRemindAddToHome", "true");
    setNeverRemindAddToHome(true);
    setAddToHomeModalVisible(false);
    setAddToHomeModalVisibleAndroid(false);
  };

  useEffect(() => {
    if (!isIOS && memberId) {
      handleSubscribe();
    }
  }, [memberId, isIOS, handleSubscribe]);

  return (
    <>
      <Modal
        centered
        open={installModalVisible}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setInstallModalVisible(false)}
        style={{ padding: "20px", textAlign: "center" }}
        width={320}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 18, margin: 0 }}>感謝您已加入主畫面</h3>
        </div>
        <p style={{ fontSize: 14, color: "#555" }}>
          現在只需一步！
          <br />
          訂閱我們的推送通知頻道，即可第一時間收到最新優惠！
        </p>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <button
            onClick={() => {
              handleSubscribe();
              setInstallModalVisible(false);
            }}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#495e4f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            立即訂閱，掌握優惠
          </button>
          <button
            onClick={handleNeverRemindInstall}
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            不再提醒
          </button>
        </div>
      </Modal>

      <Modal
        centered
        open={addToHomeModalVisible}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setAddToHomeModalVisible(false)}
        style={{ padding: "20px", textAlign: "center" }}
        width={320}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 18, margin: 0 }}>安裝應用程式</h3>
        </div>
        <p style={{ fontSize: 14, color: "#555" }}>
          如要收到推送通知，請將本應用程式安裝到你的 iOS 裝置上：
          <br />
          <br />
          請點擊 &nbsp;
          <IOSShareIcon />
          &nbsp; 分享按鈕，然後選擇
          <br />
          <strong>「 加入主畫面</strong> &nbsp; <AddToHomeScreenIcon />
          <strong> 」</strong>
        </p>
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleNeverRemindAddToHome}
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            不再提醒
          </button>
        </div>
      </Modal>

      <Modal
        centered
        open={addToHomeModalVisibleAndroid}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setAddToHomeModalVisibleAndroid(false)}
        style={{ padding: "20px", textAlign: "center" }}
        width={320}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 18, margin: 0 }}>安裝應用程式</h3>
        </div>

        <p style={{ fontSize: 14, color: "#555" }}>
          如要收到推送通知，請將此網站新增至 Android 主畫面：
          <br />
          <br />
          1. 點擊右上角的 <strong>⋮</strong> 按鈕（更多選單）
          <br />
          2. 點選{" "}
          <strong>
            「<AndroidAddToHomeScreenIcon />
            &nbsp;新增至主畫面」
          </strong>
          <br />
          3. 點選 <strong>新增</strong> 完成安裝
        </p>
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleNeverRemindAddToHome}
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            不再提醒
          </button>
        </div>
      </Modal>
    </>
  );
}
