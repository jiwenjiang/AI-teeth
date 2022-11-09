import { Image, Text, View } from "@tarojs/components";
import { getStorageSync, switchTab, useDidShow } from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import NavBar from "@/comps/NavBar";
import TabBar from "@/comps/TabBar";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Avatar from "@/static/imgs/avatar-default.png";

import styles from "./index.module.scss";

export default function App() {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (!user.phone) {
      return;
    }

    // console.log(getStorageSync('user'));
    console.log(user);
  }, [user.phone]);

  useDidShow(() => {
    setUser(getStorageSync('user'));
  });

  const onNavBarClick = () => {
    switchTab({ url: "/pages/index/index" });
  };

  const maskPhone = (phone) => {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
  }

  return (
    <View className={styles.mine}>
      <NavBar title={'个人中心'} back={onNavBarClick} />
      <View className={styles.content}>
        <View className={styles.info}>
          <Image className={styles.avatar} src={Avatar} mode='widthFix' />
          <View className={styles.other}>
            {user.phone && (
              <Text className={styles.phone}>{maskPhone(user?.phone)}</Text>
            )}
            <View className={styles.other2}>
              <Image className={styles.gender} src={user?.gender === 1 ? Male : Female} mode='widthFix' />
              {user.age && (
                <Text className={styles.age}>{user.age}岁</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <TabBar current="mine" />
    </View>
  );
}
