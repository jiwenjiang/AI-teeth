import React, { useEffect, useState } from "react";

import { Arrow } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { getMenuButtonBoundingClientRect, navigateTo } from "@tarojs/taro";

import TabBar from "@/comps/TabBar";

import Banner from "@/static/imgs/index-banner.png";

import Caries from "@/static/icons/index-caries.png";
import Evaluate from "@/static/icons/index-evaluate.png";
import Patient from "@/static/icons/index-patient.png";
import Record from "@/static/icons/index-record.png";
import Surface from "@/static/icons/index-surface.png";
import Warning from "@/static/icons/index-warning.png";

import styles from "./index.module.scss";

export default function App() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [navigationHeight, setNavigationHeight] = useState(0);

  useEffect(() => {
    setNavBarHeight();
  }, []);

  const navBarTitle = '首页';


  const setNavBarHeight = () => {
    const systemInfo = wx.getSystemInfoSync();
    let statusBarHeight2 = systemInfo.statusBarHeight;
    let boundingClientRect = getMenuButtonBoundingClientRect();
    let navigationHeight2 = boundingClientRect.height + (boundingClientRect.top - statusBarHeight2) * 2;

    setStatusBarHeight(statusBarHeight2);
    setNavigationHeight(navigationHeight2);
  };

  const mainServices = [
    {
      cnName: '儿童龋齿检测',
      enName: 'Caries detection',
      iconSrc: Caries,
      path: 'caries',
      open: true,
    },
    {
      cnName: '儿童牙合早期预警',
      enName: 'Early warning',
      iconSrc: Warning,
      path: 'warning',
      open: true,
    },
    {
      cnName: '面型自检',
      enName: 'Surface inspection',
      iconSrc: Surface,
      path: 'surface',
      open: false,
    },
    {
      cnName: '颜面评估',
      enName: 'Personnel management',
      iconSrc: Evaluate,
      path: 'evaluate',
      open: false,
    },
  ];

  const otherServices = [
    {
      cnName: '患者管理',
      enName: 'Face to assess',
      iconSrc: Patient,
      path: 'patient',
    },
    {
      cnName: '检测记录',
      enName: 'Check the record',
      iconSrc: Record,
      path: 'record',
    },
  ];

  const goToModule = (path: string) => {
    navigateTo({
      url: `/pages/${path}/index`
    })
  }

  const navBarStyles = {
    width: '100%',
    paddingTop: `${statusBarHeight}px`,
    height: `${navigationHeight}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    color: '#fff',
  };

  return (
    <View className={styles.page}>
      <View style={navBarStyles}>
        <Text>{navBarTitle}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.bannerwrapper}>
          <Image className={styles.bannerimg} src={Banner} mode='widthFix' />
        </View>
        <View className={styles.servicelist}>
          <Text className={styles.servicetitle}>服务入口</Text>
          <View className={styles.mainservices}>
            {mainServices.map((service, index) => (
              <View
                className={styles.service}
                key={index}
                onClick={() => goToModule(service.path)}
              >
                <View className={styles.serviceicon}>
                  <Image className={styles.mainicon} src={service.iconSrc} mode='widthFix' />
                  <Arrow className={styles.arrow} />
                </View>
                <View className={styles.servicename}>
                  <Text className={styles.cnname}>{service.cnName}</Text>
                  <Text className={styles.enname}>{service.enName}</Text>
                </View>
                {!service.open && (
                  <View className={styles.mask}>敬请期待...</View>
                )}
              </View>
            ))}
          </View>
          <View className={styles.otherservices}>
            {otherServices.map((service, index) => (
              <View
                className={styles.service}
                key={index}
                onClick={() => goToModule(service.path)}
              >
                <View className={styles.left}>
                  <Image className={styles.othericon} src={service.iconSrc} mode='widthFix' />
                  <View className={styles.servicename}>
                    <Text className={styles.cnname}>{service.cnName}</Text>
                    <Text className={styles.enname}>{service.enName}</Text>
                  </View>
                </View>
                <Arrow className={styles.arrow} />
              </View>
            ))}
          </View>
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
