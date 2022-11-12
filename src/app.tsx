import "@/service/http_interceptors";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import {
  getMenuButtonBoundingClientRect,
  getStorageSync,
  navigateTo,
  useDidShow
} from "@tarojs/taro";
import React, { useState } from "react";
import "./app.scss";
import "./custom-variables.scss";
import { SystemContext } from "./service/context";

function App(props) {
  const [systemInfo, setSystemInfo] = useState({ navHeight: 84 });

  const calcBarheight = async () => {
    const systemInfo = wx.getSystemInfoSync();
    let statusBarHeight2 = systemInfo.statusBarHeight;
    let boundingClientRect = getMenuButtonBoundingClientRect();
    let navigationHeight2 =
      boundingClientRect.height +
      (boundingClientRect.top - statusBarHeight2) * 2;

    setSystemInfo({ navHeight: navigationHeight2 + statusBarHeight2 });
  };

  useDidShow(() => {
    if (!getStorageSync("token")) {
      navigateTo({ url: "/packages/login/index" });
    }
    calcBarheight();
  });

  return (
    <SystemContext.Provider
      value={{ systemInfo, updateSystemInfo: setSystemInfo }}
    >
      <View className="html">{props.children}</View>
    </SystemContext.Provider>
  );
}

export default App;
