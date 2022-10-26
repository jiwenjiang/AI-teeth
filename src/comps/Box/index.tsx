import { View } from "@tarojs/components";
import React, { CSSProperties } from "react";
import "./index.scss";

export default function Box({
  title,
  children,
  styles
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  styles?: CSSProperties;
}) {
  return (
    <View className="card" style={styles}>
      <View className="title">{title}</View>
      <View>{children}</View>
    </View>
  );
}
