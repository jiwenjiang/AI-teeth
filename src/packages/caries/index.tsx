import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  View,
  Image,
  Input,
  Picker,
  Text,
  ScrollView,
} from "@tarojs/components";
import {
  navigateTo,
  showToast,
  switchTab,
  useDidShow,
  useRouter,
} from "@tarojs/taro";

import CustomButton from "@/comps/CustomButton";
import LoadMore from "@/comps/LoadMore";

import { DetectType, GenderType } from "@/service/const";
import request from "@/service/request";
import { SystemContext } from "@/service/context";

import dayjs from "dayjs";

import AddPatient from "@/static/icons/add-patient.png";
import Calendar from "@/static/icons/calendar.png";
import Female from "@/static/icons/female.png";
import IcFemaleW from "@/static/icons/ic-female-w.png";
import IcFemale from "@/static/icons/ic-female.png";
import IcMaleW from "@/static/icons/ic-male-w.png";
import IcMale from "@/static/icons/ic-male.png";
import Male from "@/static/icons/male.png";
import Warning from "@/static/icons/warning.svg";
import Banner from "@/static/imgs/patient-banner.png";
import Clear from "@/static/icons/clear.png";

import NavBar from "@/comps/NavBar";
import styles from "./index.module.scss";

const addPatientStyles = {
  fontSize: "14px",
  fontWeight: 400,
  width: "36vw",
  height: "9vw"
};

const activeMaleStyles = {
  border: "none",
  backgroundColor: "#1DA1F2"
};

const activeFemaleStyles = {
  border: "none",
  backgroundColor: "#DF76A8"
};

const activeGenderTextStyles = {
  color: "#333",
  fontWeight: 900
};

export default function App() {
  const { systemInfo } = useContext(SystemContext);
  const router = useRouter();
  const [navBarTitle, setNavBarTitle] = useState(
    +(router.params.type as any) === DetectType.CARIES
      ? "儿童龋齿检测"
      : "早期矫正预警"
  );
  const [editMode, setEditMode] = useState(false);
  const [patientList, setPatientList] = useState<
    {
      id: number;
      name: string;
      gender: GenderType;
      birthday: string;
      birthdayDate: number;
      age: number;
      latestCheck: any;
    }[]
  >([]);
  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPage: 0,
    totalRecord: 0,
  });

  const [gender, setGender] = useState(GenderType.MALE);
  const [name, setName] = useState("");
  const [showMask, setShowMask] = useState(false);
  const [birthday, setBirthday] = useState("2010-01-02");
  const [searchText, setSearchText] = useState("");
  const [lastTimeSearchAll, setLastTimeSearchAll] = useState<boolean>(true);

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    // 上次搜索非空，本次搜索为空，则重新获取全部患者
    if (!lastTimeSearchAll && !searchText) {
      getPatients();
    }
  }, [searchText]);

  useDidShow(() => {
    getPatients();
  });

  const getMorePatients = () => {
    if (pageInfo.page < pageInfo.totalPage) {
      getPatients(searchText, false, pageInfo.page + 1);
    }
  }

  const getPatients = async (search = "", fresh: boolean = true, page?: number) => {
    let url = '/children/list';
    if (page && page > 0) {
      url += `?pageNo=${page}`;
    };

    const response = await request({
      url,
      data: { type: router.params.type, name: search }
    });
    const formattedPatients = response.data.children.map((v: any) => {
      return {
        ...v,
        age: dayjs().diff(dayjs(v.birthday), 'year'),
      }
    });
    setPatientList((prev) => {
      if (fresh) {
        return formattedPatients;
      }

      return prev.concat(formattedPatients);
    });
    setPageReady(true);
    setPageInfo(response.data.page);
    setLastTimeSearchAll(!searchText);
  };

  const tag = v => {
    if (!v) return;
    let age = dayjs().diff(dayjs(v * 1000), "year");
    if (age >= 18) {
      return "成人";
    } else if (age < 12) {
      return "儿童";
    } else {
      return "青少年";
    }
  };

  const onNavBarClick = () => {
    if (showMask) {
      // 添加患者蒙版已显示，只需隐藏蒙版
      if (editMode) {
        // 编辑已有患者信息，返回时重置 editMode
        setEditMode(false);
      }
      closeAddPatientMask();
    } else {
      switchTab({ url: "/pages/index/index" });
    }
  };

  const addPatient = async () => {
    if (!name) {
      showToast({
        title: "姓名不能为空",
        icon: "error",
        duration: 2000
      });
      return;
    }

    if (dayjs(birthday, "YYYY-MM-DD").unix() > dayjs().unix()) {
      showToast({
        title: "生日填写错误",
        icon: "error",
        duration: 2000
      });
      return;
    }

    const genderValue = gender;

    try {
      await request({
        method: "POST",
        url: "/children/save",
        data: {
          name,
          gender: genderValue,
          birthday: dayjs(birthday, "YYYY-MM-DD").unix()
        }
      });
      getPatients();
      closeAddPatientMask();
    } catch (error) {
      showToast({
        title: "添加患者失败",
        icon: "error",
        duration: 2000
      });
    }
  };

  const onDateChange = e => {
    setBirthday(e.detail.value);
  };

  const onNameChange = e => {
    setName(e.detail.value);
  };

  const showAddPatientMask = () => {
    setNavBarTitle("添加患者");

    setName("");
    setGender(GenderType.MALE);
    setBirthday(dayjs().format("YYYY-MM-DD"));

    setShowMask(true);
  };

  const closeAddPatientMask = () => {
    setShowMask(false);
    setNavBarTitle(
      +(router.params.type as any) === DetectType.CARIES
        ? "儿童龋齿检测"
        : "早期矫正预警"
    );
  };

  const onConfirm = () => {
    getPatients(searchText)
  }

  const clearSearch = () => {
    setSearchText('')
  }

  const goto = v => {
    console.log("t", router.params.type);
    navigateTo({
      url: `/packages/caries/photo?childrenId=${v.id}&childName=${v.name}&type=${router.params.type}`
    });
  };

  const onSearch = () => {
    getPatients(searchText);
  };

  return (
    <View className='page'>
      <NavBar title={navBarTitle} back={onNavBarClick} />

      <View className={styles.content}>
        {/* 搜索栏 */}
        <View className={styles.searchbar}>
          <Input
            className={styles.input}
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
            onConfirm={onConfirm}
            type='text'
            placeholder='搜索'
          />
          {searchText && (
            <View className={styles.clear} onClick={clearSearch}>
              <Image className={styles.icon} src={Clear} mode='widthFix' />
            </View>
          )}
          <Text className={styles.label} onClick={onSearch}>
            搜索
          </Text>
        </View>
        {/* 患者列表 */}
        {pageReady && (<View className={styles.patientlist}>
          {/* 无患者时 */}
          {patientList.length === 0 && (
            <View className={styles.nopatient}>
              <Image className={styles.banner} src={Banner} mode='widthFix' />
              <Text className={styles.text}>暂无数据</Text>
              <CustomButton
                styles={addPatientStyles}
                click={() => showAddPatientMask()}
                text='添加患者'
              />
            </View>
          )}
          {/* 有患者时 */}
          {/* 患者列表 */}
          {patientList.length > 0 && (
            <ScrollView
              className={styles.scrollview}
              scrollY
              style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 100px)` }}
              onScrollToLower={getMorePatients}
            >
              {patientList.map((patient, index) => (
                <View
                  className={styles.patient}
                  key={index}
                  onClick={() => goto(patient)}
                >
                  <View className={styles.info}>
                    <View className={styles.upper}>
                      <Text className={styles.name}>{patient?.name}</Text>
                      <Text className={styles.seperator}></Text>
                      <Image
                        className={styles.gender}
                        src={patient.gender === GenderType.MALE ? Male : Female}
                        mode='widthFix'
                      />
                      <Text className={styles.age}>
                        {patient.age}
                        岁
                      </Text>
                      <Text className={styles.seperator}></Text>
                      <Text className={styles.time}>{patient.birthday}</Text>
                    </View>
                    {patient?.latestCheck?.checkResult && (
                      <View className={styles.middle}>
                        上次检测结果：{patient?.latestCheck?.checkResult}
                      </View>
                    )}
                    {patient.latestCheck?.hint && (
                      <View className={styles.lower}>
                        <Image src={Warning} className={styles.warning} /> 提示：
                        {patient?.latestCheck?.hint}
                      </View>
                    )}
                  </View>
                  <View className={styles.tag}>{tag(patient.birthdayDate)}</View>
                </View>
              ))}
              <LoadMore
                page={pageInfo.page}
                totalPage={pageInfo.totalPage}
              />
            </ScrollView>
          )}
          {/* 新建患者的悬浮按钮 */}
          {patientList.length > 0 && (
            <Image
              className={styles.addbtn}
              src={AddPatient}
              mode='widthFix'
              onClick={() => showAddPatientMask()}
            />
          )}
        </View>)}
        {/* 添加患者的蒙版 */}
        {showMask && (
          <View className={styles.mask}>
            <View className={styles.header}>
              <Text className={styles.title}>患者信息</Text>
              <Text className={styles.text}>输入患者信息，获取检测报告</Text>
            </View>
            <View className={styles.genders}>
              <View
                className={styles.gender}
                onClick={() => setGender(GenderType.MALE)}
              >
                <View
                  className={styles.iconwrapper}
                  style={gender === GenderType.MALE ? activeMaleStyles : {}}
                >
                  {gender === GenderType.MALE ? (
                    <Image
                      className={styles.icon}
                      src={IcMaleW}
                      mode='widthFix'
                    />
                  ) : (
                    <Image
                      className={styles.icon}
                      src={IcMale}
                      mode='widthFix'
                    />
                  )}
                </View>
                <Text
                  className={styles.text}
                  style={
                    gender === GenderType.MALE ? activeGenderTextStyles : {}
                  }
                >
                  男
                </Text>
              </View>
              <View
                className={styles.gender}
                onClick={() => setGender(GenderType.FEMALE)}
              >
                <View
                  className={styles.iconwrapper}
                  style={gender === GenderType.FEMALE ? activeFemaleStyles : {}}
                >
                  {gender === GenderType.MALE ? (
                    <Image
                      className={styles.icon}
                      src={IcFemale}
                      mode='widthFix'
                    />
                  ) : (
                    <Image
                      className={styles.icon}
                      src={IcFemaleW}
                      mode='widthFix'
                    />
                  )}
                </View>
                <Text
                  className={styles.text}
                  style={
                    gender === GenderType.FEMALE ? activeGenderTextStyles : {}
                  }
                >
                  女
                </Text>
              </View>
            </View>
            <View className={styles.other}>
              <Text className={styles.label}>名字</Text>
              <Input
                className={`${styles.input} ${styles.name}`}
                type='text'
                placeholder='请输入真实姓名'
                value={name}
                onInput={e => onNameChange(e)}
              />
              <Text className={`${styles.label} ${styles.birthday}`}>生日</Text>
              <Picker
                className={styles.datepicker}
                mode='date'
                value={birthday}
                onChange={onDateChange}
              >
                <View className={styles.pickercontent}>
                  <Image
                    className={styles.calendar}
                    src={Calendar}
                    mode='widthFix'
                  />
                  <Text className={styles.text}>{birthday}</Text>
                </View>
              </Picker>
            </View>
            <CustomButton text='保存' click={addPatient} />
          </View>
        )}
      </View>
    </View>
  );
}
