import React from "react";

import { Image, View } from "@tarojs/components";
import { navigateTo, navigateToMiniProgram } from "@tarojs/taro";
import { Arrow } from "@taroify/icons";

import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";

import Train from "@/static/icons/jujia.svg";
import SelfTest from "@/static/icons/self-test.svg";
import VideoCourse from "@/static/icons/video.svg";

import "./index.scss";

export default function App() {
  const goto = url => {
    navigateTo({ url });
  };

  const gotoOther = () => {
    navigateToMiniProgram({
      appId: 'wx98dc9b974915de77',
    });
  };

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list" onClick={() => goto("/pages/evaluate/list")}>
          <ListItem
            title="量表自测"
            subTitle="拍摄视频，自主筛查"
            left={
              <View className="left">
                <Image src={SelfTest} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
        <View className="list">
          <ListItem
            title="居家训练"
            subTitle="居家康复，远程训练"
            left={
              <View className="left">
                <Image src={Train} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
        <View className="list" onClick={() => gotoOther()}>
          <ListItem
            title="视频课程"
            subTitle="蕾波视频，助力康复"
            left={
              <View className="left">
                <Image src={VideoCourse} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
