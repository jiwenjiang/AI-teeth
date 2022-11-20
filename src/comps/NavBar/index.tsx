import NavBack from "@/static/icons/nav-back.png";
import { Image, Text, View } from "@tarojs/components";
import { getMenuButtonBoundingClientRect } from "@tarojs/taro";
import React, { CSSProperties, useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function NavBar({
  showIcon = true,
  title,
  back,
  customNavBarStyles,
  customNavIconStyles
}: {
  showIcon?: Boolean;
  title: React.ReactNode;
  back?: Function;
  customNavBarStyles?: CSSProperties;
  customNavIconStyles?: CSSProperties;
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
    paddingLeft: `14px`,
    height: `${statusBarHeight + navigationHeight}px`,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "20px",
    color: "#fff",
    position: "relative"
  };

  const navIconStyles: CSSProperties = {
    width: "9px"
  };

  const allNavBarStyles: CSSProperties = {
    ...navBarStyles,
    ...customNavBarStyles
  };

  const allNavIconStyles: CSSProperties = {
    ...navIconStyles,
    ...customNavIconStyles
  };

  return (
    <View>
      <View style={allNavBarStyles}>
        {showIcon && (
          <View className={styles.backBox} onClick={() => onNavBarClick()}>
            <Image style={allNavIconStyles} src={NavBack} mode="widthFix" />
          </View>
        )}
        <Text>{title}</Text>
        <Text />
      </View>
    </View>
  );
}
