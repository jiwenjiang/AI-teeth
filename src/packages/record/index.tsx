import React, { useEffect, useState } from "react";

import { Image, Input, Text, View } from "@tarojs/components";
import { navigateBack, navigateTo } from "@tarojs/taro";
import { Success } from "@taroify/icons";

import { GenderType, DetectType } from "@/service/const";
import request from "@/service/request";
import dayjs from "dayjs";

import NavBar from "@/comps/NavBar";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Warning from "@/static/icons/warning.svg";
import Banner from "@/static/imgs/patient-banner.png";
import Select from "@/static/icons/select.png";
import Search from "@/static/icons/search.png";
import Clear from "@/static/icons/clear.png";

import styles from "./index.module.scss";

export default function App() {
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [checkType, setCheckType] = useState<number>(0)
  const [showMask, setShowMask] = useState<boolean>(true)
  const [showClear, setShowClear] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [patientList, setPatientList] = useState<{
    id: number;
    userId: number;
    childrenId: number;
    childrenName: string;
    gender: GenderType;
    age: number;
    checkType: number;
    checkTypeStr: string;
    checkResult: string;
    checkTime: number;
    hint: string;
  }[]>([]);

  useEffect(() => {
    getPatients();
  }, [checkType]);

  useEffect(() => {
    if (searchText) {
      setShowClear(true);
    } else {
      setShowClear(false);
      setShowMask(true);
    }
  }, [searchText]);

  const checkTypes = [
    {
      id: 0,
      name: '全部记录',
    },
    {
      id: 1,
      name: '儿童龋齿检测',
    },
    {
      id: 2,
      name: '儿童早期预警',
    },
    {
      id: 3,
      name: '面型自检',
    },
    {
      id: 4,
      name: '颜面评估',
    },
  ]

  const checkResultPrefix = {
    1: '龋齿检测',
    2: '早期预警',
  }

  const getPatients = async () => {
    const response = await request({
      url: `/check/list?checkType=${checkType}${searchText ? ('&name=' + searchText) : ''}`,
    });
    setPatientList(response.data.records);
  };

  const onNavBarClick = () => {
    navigateBack();
  };

  const toggleShowSelect = () => {
    setShowSelect(!showSelect)
  }

  const hideSelect = () => {
    setShowSelect(false)
  }

  const updateCheckType = (id) => {
    setCheckType(id)
  }

  const onInput = (e) => {
    setSearchText(e.detail.value)
  }

  const onFocus = () => {
    setShowMask(false)
  }

  const onBlur = () => {
    if (!searchText) {
      setShowMask(true)
    }
  }

  const onConfirm = () => {
    if (!searchText) {
      setShowMask(true)
      return
    }

    getPatients()
  }

  const clearSearch = () => {
    setSearchText('')
  }

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
        {/* 顶部操作栏 */}
        <View className={styles.topbar}>
          {/* 筛选栏 */}
          <View
            className={styles.filterbar}
            onClick={toggleShowSelect}
          >
            <Text className={styles.label}>{checkTypes[checkType].name}</Text>
            <Image className={styles.banner} src={Select} mode='widthFix' />
          </View>
          {/* 搜索栏 */}
          <View className={styles.searchbar}>
            <Input
              className={styles.input}
              type='text'
              value={searchText}
              onInput={(e) => onInput(e)}
              onFocus={onFocus}
              onBlur={onBlur}
              onConfirm={onConfirm}
            />
            {showMask && (
              <View className={styles.mask}>
                <Image className={styles.icon} src={Search} mode='widthFix' />
                <Text className={styles.text}>搜索</Text>
              </View>
            )}
            {showClear && (
              <View className={styles.clear} onClick={clearSearch}>
                <Image className={styles.icon} src={Clear} mode='widthFix' />
              </View>
            )}
          </View>
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
                    {checkResultPrefix[patient?.checkType]}：{patient?.checkResult}
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
          {/* 筛选检测类型的下拉菜单 */}
          {showSelect && (
            <View
              className={styles.selectlist}
              onClick={hideSelect}
            >
              <View className={styles.container}>
                {checkTypes.map((item, i) => (
                  <View
                    className={`${styles.item} ${checkType === item.id && styles['text-blue']}`}
                    key={i}
                    onClick={() => updateCheckType(item.id)}
                  >
                    <Text>{item.name}</Text>
                    {(checkType === item.id) && (
                      <Success size='16' />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
