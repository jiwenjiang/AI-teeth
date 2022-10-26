import { WebView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    console.log("router.params.url", router.params.url);
  }, []);

  return <WebView src={router.params.url || ""}></WebView>;
}
