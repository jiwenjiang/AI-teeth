import { View } from "@tarojs/components";
import React, { CSSProperties, ReactNode } from "react";
import "./index.scss";

export default function ListItem({
  left,
  title,
  subTitle,
  right,
  click,
  customStyles = {}
}: Partial<
  Record<"title" | "subTitle" | "left" | "right", ReactNode> & {
    click: Function;
    customStyles?: CSSProperties;
  }
>) {
  const handle = () => {
    click?.();
  };
  return (
    <View className="list-item" style={customStyles} onClick={handle}>
      {left && <View className="left-box">{left}</View>}
      <View>
        <View className="info-title">{title}</View>
        <View className="info-node">{subTitle}</View>
      </View>
      <View className="right">{right}</View>
    </View>
  );
}
