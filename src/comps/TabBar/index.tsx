import { Tabbar } from "@taroify/core";
import { HomeOutlined, UserCircleOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import "./index.scss";

const pageList = [
  {
    page: "index",
    url: "/pages/index/index"
  },
  {
    page: "mine",
    url: "/pages/mine/index"
  }
];

export default function TabBar({ current }) {
  const handleClick = e => {
    const page = pageList[e];
    Taro.switchTab({ url: page.url });
    // setCurrent(e);
  };

  return (
    <View className="tab-wrap">
      <Tabbar value={pageList.findIndex(v => v.page === current)} fixed={true}>
        <Tabbar.TabItem icon={<HomeOutlined />} onClick={() => handleClick(0)}>
          首页
        </Tabbar.TabItem>
        <Tabbar.TabItem
          icon={<UserCircleOutlined />}
          onClick={() => handleClick(1)}
        >
          我的
        </Tabbar.TabItem>
      </Tabbar>
    </View>
  );
}
