import React from "react";

import { Tabbar } from "@taroify/core";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import HomeActive from "@/static/icons/tabbar-home-active.png";
import Home from "@/static/icons/tabbar-home.png";
import MineActive from "@/static/icons/tabbar-mine-active.png";
import Mine from "@/static/icons/tabbar-mine.png";

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
        <Tabbar.TabItem
          onClick={() => handleClick(0)}
          className="tab-item"
        >
          <Image
            src={current === pageList[0].page ? HomeActive : Home}
            className="icon"
          />
          首页
        </Tabbar.TabItem>
        <Tabbar.TabItem
          onClick={() => handleClick(1)}
          className="tab-item"
        >
          <Image
            src={current === pageList[1].page ? MineActive : Mine}
            className="icon"
          />
          我的
        </Tabbar.TabItem>
      </Tabbar>
    </View>
  );
}
