import React from "react";

import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import { Arrow } from "@taroify/icons";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import "./setting.scss";

const cusStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  width: "100%"
};

export default function App() {
  const record = () => {
    navigateTo({ url: `/pages/mine/password` });
  };

  return (
    <View className="setting">
      <View className="option" onClick={record}>
        <ListItem left="修改密码" right={<Arrow />} customStyles={cusStyle} />
      </View>
      <TabBar current="mine" />
    </View>
  );
}
