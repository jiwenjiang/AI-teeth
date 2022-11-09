import { ArrowLeft } from "@taroify/icons";
import { Text, View } from "@tarojs/components";
import { getMenuButtonBoundingClientRect } from "@tarojs/taro";
import React, { CSSProperties, useEffect, useState } from "react";
import "./index.scss";

const navIconStyles: CSSProperties = {
  position: "absolute",
  left: "16px"
};

export default function NavBar({
  showIcon = true,
  title,
  back
}: {
  showIcon?: Boolean;
  title: React.ReactNode;
  back?: Function;
}) {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [navigationHeight, setNavigationHeight] = useState(0);

  const onNavBarClick = () => {
    back?.();
  };

  const setNavBarHeight = () => {
    const systemInfo = wx.getSystemInfoSync();
    let statusBarHeight2 = systemInfo.statusBarHeight;
    let boundingClientRect = getMenuButtonBoundingClientRect();
    let navigationHeight2 =
      boundingClientRect.height +
      (boundingClientRect.top - statusBarHeight2) * 2;

    setStatusBarHeight(statusBarHeight2);
    setNavigationHeight(navigationHeight2);
  };

  useEffect(() => {
    setNavBarHeight();
  }, []);

  const navBarStyles: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    paddingTop: `${statusBarHeight}px`,
    paddingLeft: `16px`,
    paddingRight: `16px`,
    height: `${statusBarHeight + navigationHeight}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
    color: "#fff",
    position: "relative"
  };

  return (
    <View>
      <View style={navBarStyles}>
        {showIcon && (
          <ArrowLeft style={navIconStyles} onClick={() => onNavBarClick()} />
        )}
        <Text>{title}</Text>
        <Text />
      </View>
    </View>
  );
}
