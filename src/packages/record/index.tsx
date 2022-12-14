import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  View,
  Image,
  Input,
  Text,
  ScrollView,
} from "@tarojs/components";
import {
  switchTab,
  navigateTo,
} from "@tarojs/taro";
import { Success } from "@taroify/icons";

import NavBar from "@/comps/NavBar";
import LoadMore from "@/comps/LoadMore";

import { SystemContext } from "@/service/context";
import { GenderType, DetectType } from "@/service/const";
import request from "@/service/request";

import dayjs from "dayjs";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Warning from "@/static/icons/warning.svg";
import Banner from "@/static/imgs/patient-banner.png";
import Select from "@/static/icons/select.png";
import Search from "@/static/icons/search.png";
import Clear from "@/static/icons/clear.png";

import styles from "./index.module.scss";

export default function App() {
  const { systemInfo } = useContext(SystemContext);
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [checkType, setCheckType] = useState<number>(0)
  const [showMask, setShowMask] = useState<boolean>(true)
  const [showClear, setShowClear] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [checkRecords, setCheckRecords] = useState<{
    id: number;
    userId: number;
    childrenId: number;
    childrenName: string;
    gender: GenderType;
    birthday: number;
    checkType: number;
    checkTypeStr: string;
    checkResult: string;
    checkTime: number;
    hint: string;
  }[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPage: 0,
    totalRecord: 0,
  });

  let resetFlag = false;

  useEffect(() => {
    getCheckRecords();
  }, []);

  useEffect(() => {
    if (searchText) {
      setShowMask(false);
      setShowClear(true);
    } else {
      setShowClear(false);
      setShowMask(true);
    }
  }, [searchText]);

  const getMoreRecords = () => {
    if (pageInfo.page < pageInfo.totalPage) {
      getCheckRecords(false, pageInfo.page + 1);
    }
  }

  const checkTypes = [
    {
      id: 0,
      name: '????????????',
    },
    {
      id: 1,
      name: '??????????????????',
    },
    {
      id: 2,
      name: '??????????????????',
    },
    {
      id: 3,
      name: '????????????',
    },
    {
      id: 4,
      name: '????????????',
    },
  ]

  const checkResultPrefix = {
    1: '????????????',
    2: '????????????',
  }

  const getCheckRecords = async (fresh: boolean = true, page?: number) => {
    const response = await request({
      url: `/check/list?${!resetFlag ? ('&name=' + searchText) : ''}${page ? ('&pageNo=' + page) : ''}`,
    });
    setCheckRecords((prev) => {
      if (fresh) {
        return response.data.records;
      }

      return prev.concat(response.data.records);
    });
    setPageInfo(response.data.page);
  };

  const onNavBarClick = () => {
    switchTab({
      url: "/pages/index/index"
    })
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

    await getCheckRecords()
  }

  const clearSearch = async () => {
    setSearchText('')
    resetFlag = true
    await getCheckRecords()
    resetFlag = false
  }

  const tag = age => {
    if (isNaN(age)) return;

    if (age >= 18) {
      return "??????";
    } else if (age < 12) {
      return "??????";
    } else {
      return "?????????";
    }
  };

  const goto = v => {
    navigateTo({
      url: `/packages/caries/${v.checkType === DetectType.CARIES ? 'report' : 'warningReport'}?id=${v.id}&childName=${v.childrenName}`,
    });
  };

  return (
    <View className={styles.page}>
      <NavBar title='????????????' back={onNavBarClick} />

      <View className={styles.content}>
        {/* ??????????????? */}
        <View className={styles.topbar}>
          {/* ????????? */}
          <View
            className={styles.filterbar}
            onClick={toggleShowSelect}
          >
            <Text className={styles.label}>{checkTypes[checkType].name}</Text>
            <Image className={styles.banner} src={Select} mode='widthFix' />
          </View>
          {/* ????????? */}
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
                <Text className={styles.text}>??????</Text>
              </View>
            )}
            {showClear && (
              <View className={styles.clear} onClick={clearSearch}>
                <Image className={styles.icon} src={Clear} mode='widthFix' />
              </View>
            )}
          </View>
        </View>
        {/* ???????????? */}
        <View className={styles['check-records']}>
          {/* ???????????? */}
          {checkRecords.length === 0 && (
            <View className={styles.nopatient}>
              <Image className={styles.banner} src={Banner} mode='widthFix' />
              <Text className={styles.text}>????????????</Text>
            </View>
          )}
          {/* ???????????? */}
          {/* ???????????? */}
          {checkRecords.length > 0 &&
            <ScrollView
              scrollY
              style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 120px)` }}
              onScrollToLower={getMoreRecords}
            >
              {checkRecords.map((patient, index) => (
                (checkType === 0 || (checkType > 0 && patient.checkType === checkType)) ? (
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
                          {dayjs().diff(dayjs.unix(patient.birthday), 'year')}???
                        </Text>
                        <Text className={styles.seperator}></Text>
                        <Text className={styles.time}>{dayjs.unix(patient.checkTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                      </View>
                      {patient?.checkResult && (
                        <View className={styles.middle}>
                          {checkResultPrefix[patient?.checkType]}???{patient?.checkResult}
                        </View>
                      )}
                      {patient.hint && (
                        <View className={styles.lower}>
                          <Image src={Warning} className={styles.warning} /> ?????????
                          {patient?.hint}
                        </View>
                      )}
                    </View>
                    <View className={styles.tag}>{tag(dayjs().diff(dayjs(patient.birthday), 'year'))}</View>
                  </View>
                ) : null
              ))}
              <LoadMore
                page={pageInfo.page}
                totalPage={pageInfo.totalPage}
              />
            </ScrollView>
          }
          {/* ????????????????????????????????? */}
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
