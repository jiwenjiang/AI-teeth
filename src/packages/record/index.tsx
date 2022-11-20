import React, { useEffect, useState } from "react";

import { Image, Input, Text, View } from "@tarojs/components";
import { navigateBack, navigateTo } from "@tarojs/taro";

import { GenderType, DetectType } from "@/service/const";
import request from "@/service/request";
import dayjs from "dayjs";

import NavBar from "@/comps/NavBar";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Warning from "@/static/icons/warning.svg";
import Banner from "@/static/imgs/patient-banner.png";

import styles from "./index.module.scss";

export default function App() {
  const [patientList, setPatientList] = useState<{
    childrenId: number;
    childrenName: string;
    gender: GenderType;
    age: number;
    checkTime: number;
    checkResult: string;
    hint: string;
  }[]>([]);

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients =async () => {
    const response = await request({
      url: '/check/list',
    });
    setPatientList(response.data.records);
  };

  const onNavBarClick = () => {
    navigateBack();
  };

  const tag = age => {
    if (!age) return;

    if (age >= 18) {
      return "成人";
    } else if (age < 12) {
      return "儿童";
    } else {
      return "青少年";
    }
  };

  const goto = v => {
    navigateTo({
      url: `/pages/caries/${v.checkType === DetectType.CARIES ? 'report' : 'warningReport'}?id=${v.id}&childName=${v.childrenName}`,
    });
  };

  return (
    <View className={styles.page}>
      <NavBar title='检测记录' back={onNavBarClick} />

      <View className={styles.content}>
        {/* 搜索栏 */}
        <View className={styles.searchbar}>
          <Input className={styles.input} type='text' placeholder='搜索' />
          <Text className={styles.label}>搜索</Text>
        </View>
        {/* 患者列表 */}
        <View className={styles.patientlist}>
          {/* 无患者时 */}
          {patientList.length === 0 && (
            <View className={styles.nopatient}>
              <Image className={styles.banner} src={Banner} mode='widthFix' />
              <Text className={styles.text}>暂无数据</Text>
            </View>
          )}
          {/* 有患者时 */}
          {/* 患者列表 */}
          {patientList.length > 0 && patientList.map((patient, index) => (
            <View
              className={styles.patient}
              key={index}
              onClick={() => goto(patient)}
            >
              <View className={styles.info}>
                <View className={styles.upper}>
                  <Text className={styles.name}>{patient.childrenName}</Text>
                  <Text className={styles.seperator}></Text>
                  <Image
                    className={styles.gender}
                    src={patient.gender === GenderType.MALE ? Male : Female}
                    mode="widthFix"
                  />
                  <Text className={styles.age}>
                    {patient.age}岁
                  </Text>
                  <Text className={styles.seperator}></Text>
                  <Text className={styles.time}>{dayjs.unix(patient.checkTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </View>
                {patient?.checkResult && (
                  <View className={styles.middle}>
                    <View className={styles.last}>上次检测结果：</View>
                    <View className={styles.result}>
                      {patient?.checkResult}
                    </View>
                  </View>
                )}
                {patient.hint && (
                  <View className={styles.lower}>
                    <Image src={Warning} className={styles.warning} /> 提示：
                    {patient?.hint}
                  </View>
                )}
              </View>
              <View className={styles.tag}>{tag(patient.age)}</View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
