import React from "react";

import { Image, View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";

import NavBar from "@/comps/NavBar";
import TabBar from "@/comps/TabBar";

import Arrow from "@/static/icons/arrow-right.png";
import Patient from "@/static/icons/index-patient.png";
import Record from "@/static/icons/index-record.png";
import Banner from "@/static/imgs/index-banner.png";
import Caries from "@/static/imgs/index-caries.png";
import Evaluate from "@/static/imgs/index-evaluate.png";
import Surface from "@/static/imgs/index-surface.png";
import Warning from "@/static/imgs/index-warning.png";

import styles from "./index.module.scss";

export default function App() {
  const mainServices = [
    {
      cnName: "儿童龋齿检测",
      bgSrc: Caries,
      path: "caries",
      open: true
    },
    {
      cnName: "儿童早期预警",
      bgSrc: Warning,
      path: "warning",
      open: true
    },
    {
      cnName: "面型自检",
      bgSrc: Surface,
      path: "surface",
      open: false
    },
    {
      cnName: "颜面评估",
      bgSrc: Evaluate,
      path: "evaluate",
      open: false
    }
  ];

  const otherServices = [
    {
      cnName: "患者管理",
      iconSrc: Patient,
      path: "patient"
    },
    {
      cnName: "检测记录",
      iconSrc: Record,
      path: "record"
    }
  ];

  const goToModule = (path: string) => {
    navigateTo({
      url: `/pages/${path}/index`
    });
  };

  return (
    <View className={styles.page}>
      <NavBar showIcon={false} title={"首页"} />
      <View className={styles.content}>
        <View className={styles.bottomlayer}></View>
        <View className={styles.bannerwrapper}>
          <Image className={styles.bannerimg} src={Banner} mode="widthFix" />
        </View>
        <View className={styles.servicelist}>
          <View className={styles.mainservices}>
            {mainServices.map((service, index) => (
              <View
                className={styles.service}
                key={index}
                onClick={() => goToModule(service.path)}
              >
                <Image
                  className={styles.bg}
                  src={service.bgSrc}
                  mode="widthFix"
                />
                <View className={styles.name}>{service.cnName}</View>
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
                  <Image
                    className={styles.othericon}
                    src={service.iconSrc}
                    mode="widthFix"
                  />
                  <View className={styles.servicename}>{service.cnName}</View>
                </View>
                <Image className={styles.arrow} src={Arrow} mode="widthFix" />
              </View>
            ))}
          </View>
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
