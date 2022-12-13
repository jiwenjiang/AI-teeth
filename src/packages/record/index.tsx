import React, { useEffect, useState } from "react";

import { Image, Input, Text, View } from "@tarojs/components";
import { navigateBack, navigateTo, useReachBottom, showLoading, hideLoading } from "@tarojs/taro";
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
  const [pageInfo, setPageInfo] = useState<any>(null);

  let resetFlag = false;

  useEffect(() => {
    getPatients();
  }, [checkType]);

  useEffect(() => {
    if (searchText) {
      setShowMask(false);
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
      name: '早期矫正预警',
    },
    {
      id: 3,
      name: '面型自检',
    },
    {
      id: 4,
      name: '面型分析',
    },
  ]

  const checkResultPrefix = {
    1: '龋齿检测',
    2: '早期预警',
  }

  const getPatients = async () => {
    const response = await request({
      url: `/check/list?checkType=${checkType}${!resetFlag ? ('&name=' + searchText) : ''}`,
    });
    setPatientList(response.data.records);
    setPageInfo(response.data.page);
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
    setSearchText(e.detail.value.trim())
  }

  const onFocus = () => {
    setShowMask(false)
  }

  const onBlur = () => {
    if (!searchText) {
      setShowMask(true)
    }
  }

  const onConfirm = async () => {
    if (!searchText) {
      setShowMask(true)
      return
    }

    await getPatients()
  }

  const clearSearch = async () => {
    setSearchText('')
    resetFlag = true
    await getPatients()
    resetFlag = false
  }

  const tag = age => {
    if (isNaN(age)) return;

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

  useReachBottom(async () => {
    if (pageInfo.page < pageInfo.totalPage) {
      showLoading({
        title: '加载中...',
      })

      const response = await request({
        url: `/check/list?checkType=${checkType}${searchText ? `&name=${searchText}` : ''}&pageNo=${pageInfo.page + 1}`,
      });
      setPatientList(patientList.concat(response.data.records));
      setPageInfo(response.data.page);

      await new Promise(resolve => setTimeout(resolve, 1000));
      hideLoading();
    }
  });

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
          {/* 上拉加载更多 */}
          {(patientList.length > 0 && pageInfo?.page) && (
            <View className={styles.loadmore}>
              <Text className={styles.text}>{pageInfo?.page < pageInfo?.totalPage ? '上拉加载更多' : '已加载全部内容'}</Text>
            </View>
          )}
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
