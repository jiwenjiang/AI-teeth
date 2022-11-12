import "@/service/http_interceptors";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import { getStorageSync, navigateTo, useDidShow } from "@tarojs/taro";
import React from "react";
import "./app.scss";
import "./custom-variables.scss";

function App(props) {
  useDidShow(() => {
    if (!getStorageSync('token')) {
      navigateTo({ url: 'packageLogin/pages/index' });
    }
  });
  return (
    <View className="html">{props.children}</View>
  );
}

export default App;
