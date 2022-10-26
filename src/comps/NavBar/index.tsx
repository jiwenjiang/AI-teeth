import { ArrowLeft } from "@taroify/icons";
import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import "./index.scss";

export default function NavBar({
  title,
  back
}: {
  title: React.ReactNode;
  back?: Function;
}) {
  const [navigationBarHeight, setNavigationBarHeight] = useState(40);
  const [BarHeight, setStatusBarHeight] = useState(44);
  const [menuButtonHeight, setMenuButtonHeight] = useState(32);
  const [
    navigationBarAndStatusBarHeight,
    setNavigationBarAndStatusBarHeight
  ] = useState(84);
  const router = useRouter();

  useEffect(() => {
    const { statusBarHeight = 44, platform } = Taro.getSystemInfoSync();
    const { top, height } = Taro.getMenuButtonBoundingClientRect();
    setStatusBarHeight(statusBarHeight);
    setMenuButtonHeight(height ?? 32);
    if (top && top !== 0 && height && height !== 0) {
      const navigationBarHeight = (top - statusBarHeight) * 2 + height;
      setNavigationBarHeight(navigationBarHeight);
      setNavigationBarAndStatusBarHeight(statusBarHeight + navigationBarHeight);
    } else {
      const navigationBarHeight = platform === "android" ? 48 : 40;
      setNavigationBarHeight(navigationBarHeight);
      setNavigationBarAndStatusBarHeight(statusBarHeight + navigationBarHeight);
    }
  }, []);

  const backFn = () => {
    if (back) {
      back();
    } else {
      if (router.params.returnUrl) {
        if (
          ["/pages/index/index", "/pages/mine/index"].includes(
            router.params.returnUrl
          )
        ) {
          Taro.switchTab({ url: router.params.returnUrl });
        } else {
          Taro.navigateTo({
            url: router.params.returnUrl
          });
        }

        return;
      }
      Taro.navigateBack();
    }
  };

  return (
    <View>
      <view
        className="navigation-container"
        style={{ height: navigationBarAndStatusBarHeight }}
      >
        <view style={{ height: BarHeight }}></view>
        <view
          className="navigation-bar"
          style={{ height: navigationBarHeight }}
        >
          <view
            className="navigation-buttons"
            style={{ height: menuButtonHeight }}
            onClick={backFn}
          >
            <ArrowLeft />
          </view>
          <view
            className="navigation-title"
            style={{ height: navigationBarHeight }}
          >
            {title}
          </view>
        </view>
      </view>
      <view style={{ height: navigationBarAndStatusBarHeight }}></view>
    </View>
  );
}
