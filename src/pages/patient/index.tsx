import React, { useEffect, useState } from "react";

import { Button, Image, Input, Text, View } from "@tarojs/components";
import { getMenuButtonBoundingClientRect } from "@tarojs/taro";

import AddPatient from "@/static/icons/add-patient.png";
import Delete from "@/static/icons/delete.png";
import Edit from "@/static/icons/edit.png";
import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Banner from "@/static/imgs/patient-banner.png";

import styles from "./index.module.scss";

export default function App() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [navigationHeight, setNavigationHeight] = useState(0);
  const [navBarTitle, setNavBarTitle] = useState('患者管理');
  const [patientList, setPatientList] = useState<{
    name: string;
    sex: string;
    age: number;
    lastExamined: string;
  }[]>([]);

  useEffect(() => {
    setNavBarHeight();
  }, []);

  const setNavBarHeight = () => {
    const systemInfo = wx.getSystemInfoSync();
    let statusBarHeight2 = systemInfo.statusBarHeight;
    let boundingClientRect = getMenuButtonBoundingClientRect();
    let navigationHeight2 = boundingClientRect.height + (boundingClientRect.top - statusBarHeight2) * 2;

    setStatusBarHeight(statusBarHeight2);
    setNavigationHeight(navigationHeight2);
  };

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

  const tempPatientList = [
    {
      name: '郭雨辰',
      sex: 'female',
      age: 12,
      lastExamined: '2021-02-02',
    },
    {
      name: '郭雨辰',
      sex: 'female',
      age: 12,
      lastExamined: '2021-02-02',
    },
    {
      name: '郭雨辰',
      sex: 'female',
      age: 12,
      lastExamined: '2021-02-02',
    },
    {
      name: '郭雨辰',
      sex: 'female',
      age: 12,
      lastExamined: '2021-02-02',
    },
  ];

  const addPatients = () => {
    setPatientList(tempPatientList);
  };

  return (
    <View className={styles.page}>
      <View style={navBarStyles}>
        <Text>{navBarTitle}</Text>
      </View>
      <View className={styles.content}>
        {/* 搜索栏 */}
        <View className={styles.searchbar}>
          <Input className={styles.input} type='text' placeholder='搜索' />
          <Text className={styles.label}>搜索</Text>
        </View>
        <View className={styles.patientlist}>
          {/* 无患者时 */}
          {patientList.length === 0 && (
            <View className={styles.nopatient}>
              <Image className={styles.banner} src={Banner} mode='heightFix' />
              <Text className={styles.text}>暂无数据</Text>
              <Button
                className={styles.add}
                onClick={() => addPatients()}
              >添加患者</Button>
            </View>
          )}
          {/* 有患者时 */}
          {patientList.length > 0 && patientList.map((patient, index) => (
            <View className={styles.patient} key={index}>
              <View className={styles.info}>
                <View className={styles.upper}>
                  <Text className={styles.name}>{patient.name}</Text>
                  <Text className={styles.seperator}></Text>
                  <Image className={styles.sex} src={patient.sex === 'male' ? Male : Female} mode='heightFix' />
                  <Text className={styles.age}>{patient.age}岁</Text>
                </View>
                <View className={styles.lower}>上次检测时间：{patient.lastExamined}</View>
              </View>
              <View className={styles.actions}>
                <Image className={styles.action} src={Edit} mode='heightFix' />
                <Image className={styles.action} src={Delete} mode='heightFix' />
              </View>
            </View>
          ))}
          {patientList.length > 0 && (
            <Image className={styles.addbtn} src={AddPatient} mode='heightFix' />
          )}
        </View>
      </View>
    </View>
  );
}
