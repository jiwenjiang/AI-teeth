import { Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo, setStorageSync, switchTab } from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import NavBar from "@/comps/NavBar";
import TabBar from "@/comps/TabBar";

import { MediaType } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";

import { Arrow } from "@taroify/icons";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import About from "@/static/icons/mine-about.png";
import Agreement from "@/static/icons/mine-agreement.png";
import Privacy from "@/static/icons/mine-privacy.png";
import Avatar from "@/static/imgs/avatar-default.png";

import styles from "./index.module.scss";

export default function App() {
  const [user, setUser] = useState<any>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await request({
        url: "/user/get",
      });

      const user = {
        ...getStorageSync('user'),
        birthday: data.birthday,
        avatarUrl: data.avatarUrl,
        age: dayjs().year() - dayjs(data.birthday).year(),
      };

      setUser(user);
      setStorageSync('user', user);
    })();
  }, []);

  const updateUser = async (v) => {
    await request({
      url: "/user/update",
      method: 'POST',
      data: {
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        avatarFileId: v.id,
      },
    });

    const updatedUser = {
      ...user,
      avatar: v.id,
      avatarUrl: v.url,
    };

    setUser(updatedUser);
    setStorageSync('user', updatedUser);
  }

  const entries = [
    {
      title: '关于我们',
      iconSrc: About,
      page: '/packages/login/about',
    },
    {
      title: '用户协议',
      iconSrc: Agreement,
      page: '/packages/login/terms?category=user',
    },
    {
      title: '隐私协议',
      iconSrc: Privacy,
      page: '/packages/login/terms?category=privacy',
    },
  ];

  const onNavBarClick = () => {
    switchTab({ url: "/pages/index/index" });
  };

  const maskPhone = (phone) => {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
  };

  const mediaList = async ({ type, filePath, thumbTempFilePath }) => {
    upload2Server(filePath, type, v => {
      updateUser(v);
    });
  };

  const uploadPhoto = (sourceType: 'album' | 'camera') => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: [sourceType],
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        setOpen(false);

        wx.editImage({
          src: filePath,
          success(res) {
            mediaList({
              type: MediaType.PICTURE,
              filePath: res.tempFilePath,
              thumbTempFilePath: res.tempFilePath
            });
          },
          fail(e) {
            console.log("err", e);
          }
        });
      }
    });
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <View className={styles.mine}>
      <NavBar title={'个人中心'} back={onNavBarClick} />
      <View className={styles.content}>
        <View className={styles.info}>
          <Image
            className={styles.avatar}
            src={user.avatarUrl ? user.avatarUrl : Avatar}
            mode='scaleToFill'
            onClick={() => setOpen(true)}
          />
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
        <View className={styles.entries}>
          {entries.map((entry, i) => (
            <View
              className={styles.entry}
              key={i}
              onClick={() => navigateTo({ url: entry.page })}
            >
              <View className={styles.left}>
                <Image className={styles.icon} src={entry.iconSrc} mode='widthFix' />
                <Text className={styles.text}>{entry.title}</Text>
              </View>
              <Arrow className={styles.enter} />
            </View>
          ))}
        </View>
      </View>
      <Popup
        className={styles.popup}
        defaultOpen
        placement="bottom"
        open={open}
        onClose={closePopup}
      >
        <View className={styles.list} onClick={() => uploadPhoto('album')}>
          从相册中选择
        </View>
        <View className={styles.list} onClick={() => uploadPhoto('camera')}>
          拍照
        </View>
        <View className={styles.list} onClick={closePopup}>
          取消
        </View>
      </Popup>
      <TabBar current="mine" />
    </View>
  );
}
