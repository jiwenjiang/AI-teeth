import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  showToast,
  switchTab,
} from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input,
  Picker,
  ScrollView,
} from "@tarojs/components";

import CustomButton from "@/comps/CustomButton";
import LoadMore from "@/comps/LoadMore";

import { GenderType } from "@/service/const";
import request from "@/service/request";
import dayjs from "dayjs";

import NavBar from "@/comps/NavBar";

import { SystemContext } from "@/service/context";

import AddPatient from "@/static/icons/add-patient.png";
import Calendar from "@/static/icons/calendar.png";
import Delete from "@/static/icons/delete.png";
import Edit from "@/static/icons/edit.png";
import Female from "@/static/icons/female.png";
import IcFemaleW from "@/static/icons/ic-female-w.png";
import IcFemale from "@/static/icons/ic-female.png";
import IcMaleW from "@/static/icons/ic-male-w.png";
import IcMale from "@/static/icons/ic-male.png";
import Male from "@/static/icons/male.png";
import Banner from "@/static/imgs/patient-banner.png";
import Clear from "@/static/icons/clear.png";
import Close from "@/static/icons/close.png";
import Warn from "@/static/icons/warn.png";

import styles from "./index.module.scss";

export default function App() {
  const { systemInfo } = useContext(SystemContext);
  const [navBarTitle, setNavBarTitle] = useState('患者管理');
  const [editMode, setEditMode] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [patientList, setPatientList] = useState<{
    id: number;
    name: string;
    gender: GenderType;
    birthday: string;
    birthdayDate: number;
    age: number;
    createTime: string;
  }[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPage: 0,
    totalRecord: 0,
  });
  const [currPatient, setCurrPatient] = useState<{
    id: number;
    name: string;
    gender: GenderType;
    birthday: string;
    birthdayDate: number;
    age: number;
    createTime: string;
  }>();
  const [gender, setGender] = useState(GenderType.MALE);
  const [name, setName] = useState('');
  const [showMask, setShowMask] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [birthday, setBirthday] = useState('2010-01-02');
  const [namePlaceholder, setNamePlaceholder] = useState('请输入真实姓名');
  const [lastTimeSearchAll, setLastTimeSearchAll] = useState<boolean>(true);

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    if (patientList.length === 0) {
      return;
    };

    setCurrPatient(patientList[0]);
  }, [patientList]);

  useEffect(() => {
    // 上次搜索非空，本次搜索为空，则重新获取全部患者
    if (!lastTimeSearchAll && !searchText) {
      getPatients();
    }
  }, [searchText]);

  const getMorePatients = () => {
    if (pageInfo.page < pageInfo.totalPage) {
      getPatients(false, pageInfo.page + 1);
    }
  };

  const getPatients = async (fresh: boolean = true, page?: number) => {
    let url = '/children/list'
    if (searchText) {
      url += `?name=${searchText}`
    }
    if (page && page > 0 && searchText) {
      url += `&pageNo=${page}`
    } else if (page && page > 0 && !searchText) {
      url += `?pageNo=${page}`
    }

    const response = await request({
      url,
    });
    setPatientList((prev) => {
      if (fresh) {
        return response.data.children;
      }

      return prev.concat(response.data.children);
    });
    setPageInfo(response.data.page);
    setLastTimeSearchAll(!searchText);
  };

  const addPatientStyles = {
    fontSize: '16px',
    fontWeight: 400,
    width: '36vw',
    height: '9vw',
  };

  const activeMaleStyles = {
    border: 'none',
    backgroundColor: '#1DA1F2',
  };

  const activeFemaleStyles = {
    border: 'none',
    backgroundColor: '#DF76A8',
  };

  const activeGenderTextStyles = {
    color: '#333',
    fontWeight: 900,
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

  const onInput = (e) => {
    setSearchText(e.detail.value)
  }

  const onConfirm = () => {
    getPatients()
  }

  const clearSearch = () => {
    setSearchText('')
  }

  const savePatient = async () => {
    if (!name) {
      showToast({
        title: '姓名不能为空',
        icon: "error",
        duration: 2000,
      });
      return;
    };

    if (dayjs(birthday, "YYYY-MM-DD").unix() > dayjs().unix()) {
      showToast({
        title: '生日填写错误',
        icon: "error",
        duration: 2000,
      });
      return;
    }

    const genderValue = gender;
    const payload = {
      name,
      gender: genderValue,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      id: 0,
    };
    if (editMode && currPatient) {
      payload.id = currPatient.id;
    }

    try {
      await request({
        method: 'POST',
        url: `/children/${editMode ? 'update' : 'save'}`,
        data: payload,
      });
      getPatients();
      closeAddPatientMask();

    } catch (error) {
      showToast({
        title: '添加患者失败',
        icon: "error",
        duration: 2000,
      });
    } finally {
      setName('');
      setNamePlaceholder('请输入真实姓名');
    }
  };

  const deletePatient = async (patient) => {
    setShowDelete(true);
    setCurrPatient(patient);
  };

  const onConfirmDeletePatient = async () => {
    await request({
      url: `/children/delete?id=${currPatient?.id}`,
    });
    getPatients();
  };

  const onDateChange = (e) => {
    setBirthday(e.detail.value);
  };

  const onNameChange = (e) => {
    setName(e.detail.value);
  };

  const onNameFocus = (e) => {
    if (!e.detail.value) {
      setNamePlaceholder('');
    }
  };

  const onNameBlur = (e) => {
    if (!e.detail.value) {
      setNamePlaceholder('请输入真实姓名');
    };
  };

  const showAddPatientMask = () => {
    setNavBarTitle('添加患者');

    setName('');
    setGender(GenderType.MALE);
    setBirthday(dayjs().format('YYYY-MM-DD'));

    setShowMask(true);
  };

  const showEditPatientMask = (patient) => {
    setEditMode(true);
    setNavBarTitle('编辑患者');

    setCurrPatient(patient);
    setName(patient.name);
    setGender(patient.gender);
    setBirthday(patient.birthday);

    setShowMask(true);
  };

  const closeAddPatientMask = () => {
    setShowMask(false);
    setNavBarTitle('患者管理');
  };

  return (
    <View className={styles.page}>
      <NavBar title={navBarTitle} back={onNavBarClick} />
      <View className={styles.content}>
        {/* 搜索栏 */}
        <View className={styles.searchbar}>
          <Input
            className={styles.input}
            type='text'
            value={searchText}
            placeholder='搜索'
            onInput={(e) => onInput(e)}
            onConfirm={onConfirm}
          />
          {searchText && (
            <View className={styles.clear} onClick={clearSearch}>
              <Image className={styles.icon} src={Clear} mode='widthFix' />
            </View>
          )}
          <View className={styles.label} onClick={onConfirm}>搜索</View>
        </View>
        {/* 患者列表 */}
        <View className={styles.patientlist}>
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
                <View className={styles.patient} key={index}>
                  <View className={styles.info}>
                    <View className={styles.upper}>
                      <Text className={styles.name}>{patient.name}</Text>
                      <Text className={styles.seperator}></Text>
                      <Image className={styles.gender} src={patient.gender === 1 ? Male : Female} mode='widthFix' />
                      <Text className={styles.age}>{patient.age}岁</Text>
                    </View>
                    <View className={styles.lower}>创建时间　{patient.createTime}</View>
                  </View>
                  <View className={styles.actions}>
                    <Image
                      className={styles.action}
                      src={Edit}
                      mode='aspectFill'
                      onClick={() => showEditPatientMask(patient)}
                    />
                    <Image
                      className={styles.action}
                      src={Delete}
                      mode='aspectFill'
                      onClick={() => deletePatient(patient)}
                    />
                  </View>
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
        </View>
        {/* 添加/编辑患者的蒙版 */}
        {showMask && (
          <View className={styles.mask}>
            <View className={styles.header}>
              <Text className={styles.title}>患者信息</Text>
              <Text className={styles.text}>输入患者信息，获取检测报告</Text>
            </View>
            {/* 选择性别 */}
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
                    <Image className={styles.icon} src={IcMaleW} mode='widthFix' />
                  ) : (
                    <Image className={styles.icon} src={IcMale} mode='widthFix' />
                  )}
                </View>
                <Text
                  className={styles.text}
                  style={gender === GenderType.MALE ? activeGenderTextStyles : {}}
                >男</Text>
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
                    <Image className={styles.icon} src={IcFemale} mode='widthFix' />
                  ) : (
                    <Image className={styles.icon} src={IcFemaleW} mode='widthFix' />
                  )}
                </View>
                <Text
                  className={styles.text}
                  style={gender === GenderType.FEMALE ? activeGenderTextStyles : {}}
                >女</Text>
              </View>
            </View>
            {/* 填写名字，选择生日 */}
            <View className={styles.other}>
              <Text className={styles.label}>名字</Text>
              <Input
                className={`${styles.input} ${styles.name}`}
                type='text'
                placeholder={namePlaceholder}
                value={name}
                onInput={(e) => onNameChange(e)}
                onFocus={(e) => onNameFocus(e)}
                onBlur={(e) => onNameBlur(e)}
              />
              <Text className={`${styles.label} ${styles.birthday}`}>生日</Text>
              <Picker
                className={styles.datepicker}
                mode='date'
                value={birthday}
                onChange={onDateChange}
              >
                <View className={styles.pickercontent}>
                  <Image className={styles.calendar} src={Calendar} mode='widthFix' />
                  <Text className={styles.text}>{birthday}</Text>
                </View>
              </Picker>
            </View>
            <CustomButton text='保存' click={savePatient} />
          </View>
        )}
        {/* 删除患者的蒙版 */}
        {showDelete && (
          <View className={styles['delete-mask']} onClick={() => setShowDelete(false)}>
            <View className={styles.content}>
              <View className={styles.top}>
                <View className={styles.header}>
                  <View className={styles.left}>
                    <Image className={styles.warn} src={Warn} />
                    <Text className={styles.title}>提示</Text>
                  </View>
                  <Image className={styles.right} src={Close} />
                </View>
                <View className={styles.main}>是否确认删除</View>
              </View>
              <View className={styles.bottom}>
                <View
                  className={styles.cancel}
                  onClick={() => setShowDelete(false)}
                >取消</View>
                <View
                  className={styles.confirm}
                  onClick={onConfirmDeletePatient}
                >确定</View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
