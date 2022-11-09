import React, { useEffect, useState } from "react";

import { Image, Input, Picker, Text, View } from "@tarojs/components";
import { showModal, showToast, switchTab } from "@tarojs/taro";

import CustomButton from "@/comps/CustomButton";

import { GenderType } from "@/service/const";
import request from "@/service/request";
import dayjs from "dayjs";

import NavBar from "@/comps/NavBar";

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

import styles from "./index.module.scss";

export default function App() {
  const [navBarTitle, setNavBarTitle] = useState('患者管理');
  const [editMode, setEditMode] = useState(false);
  const [patientList, setPatientList] = useState<{
    id: number;
    name: string;
    gender: GenderType;
    birthday: string;
    birthdayDate: number;
  }[]>([]);
  const [currPatient, setCurrPatient] = useState<{
    id: number;
    name: string;
    gender: GenderType;
    birthday: string;
    birthdayDate: number;
  }>();
  const [gender, setGender] = useState(GenderType.MALE);
  const [name, setName] = useState('');
  const [showMask, setShowMask] = useState(false);
  const [birthday, setBirthday] = useState('2010-01-02');

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    if (patientList.length === 0) {
      return;
    };

    setCurrPatient(patientList[0]);
  }, [patientList]);

  const getPatients =async () => {
    const response = await request({
      url: '/children/list',
    });
    setPatientList(response.data.children);
  };

  const addPatientStyles = {
    fontSize: '14px',
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
    }
  };

  const deletePatient = async (patient) => {
    setCurrPatient(patient);

    showModal({
      title: '提示',
      content: `确认删除患者${patient.name}？`,
      success: onConfirmDeletePatient,
    });
  };

  const onConfirmDeletePatient = async (res) => {
    if (res.confirm) {
      await request({
        url: `/children/delete?id=${currPatient?.id}`,
      });
      getPatients();
    }
  };

  const onDateChange = (e) => {
    setBirthday(e.detail.value);
  };

  const onNameChange = (e) => {
    setName(e.detail.value);
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
              <CustomButton
                styles={addPatientStyles}
                click={() => showAddPatientMask()}
                text={'添加患者'}
              />
            </View>
          )}
          {/* 有患者时 */}
          {/* 患者列表 */}
          {patientList.length > 0 && patientList.map((patient, index) => (
            <View className={styles.patient} key={index}>
              <View className={styles.info}>
                <View className={styles.upper}>
                  <Text className={styles.name}>{patient.name}</Text>
                  <Text className={styles.seperator}></Text>
                  <Image className={styles.gender} src={patient.gender === 1 ? Male : Female} mode='widthFix' />
                  <Text className={styles.age}>{dayjs().year() - dayjs.unix(patient.birthdayDate).year()}岁</Text>
                </View>
                <View className={styles.lower}>创建时间　{'2022-10-09'}</View>
              </View>
              <View className={styles.actions}>
                <Image
                  className={styles.action}
                  src={Edit}
                  mode='widthFix'
                  onClick={() => showEditPatientMask(patient)}
                />
                <Image
                  className={styles.action}
                  src={Delete}
                  mode='widthFix'
                  onClick={() => deletePatient(patient)}
                />
              </View>
            </View>
          ))}
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
              <Text className={styles.title}>{editMode ? '您的个人资料' : '患者信息'}</Text>
              <Text className={styles.text}>{editMode ? '更新你的个人资料，从医生那里获得更好的答案' : '输入患者信息，获取检测报告'}</Text>
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
                placeholder='请输入真实姓名'
                value={name}
                onInput={(e) => onNameChange(e)}
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
            <CustomButton text={'保存'} click={savePatient} />
          </View>
        )}
      </View>
    </View>
  );
}
