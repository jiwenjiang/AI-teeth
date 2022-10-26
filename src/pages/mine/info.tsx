import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import { MediaType } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import { Notify } from "@taroify/core";
import Button from "@taroify/core/button/button";
import { Image, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import styles from "./info.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };
const genders = ["男", "女"];

export default function App() {
  const [url, setUrl] = useState();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<any>();
  const [birthday, setBirthday] = useState("");
  const avatarFileId = useRef();

  const onNameChange = value => {
    setName(value);
  };

  const onGenderChange = e => {
    setGender(genders[e.detail.value]);
  };

  const onBirthdayChange = e => {
    setBirthday(e.detail.value);
  };

  const getUser = async () => {
    const res = await request({
      url: "/user/get",
      method: "GET"
    });
    setName(res.data?.name);
    setBirthday(dayjs.unix(res.data?.birthday as any).format("YYYY-MM-DD"));
    setGender(res.data?.gender === 1 ? "男" : "女");
    setUrl(res.data?.avatarUrl);
    console.log("🚀 ~ file: info.tsx ~ line 34 ~ getUser ~ res", res);
  };

  const save = async () => {
    if (!name) {
      Notify.open({ color: "warning", message: "请输入姓名" });
      return;
    }
    if (!birthday) {
      Notify.open({ color: "warning", message: "请输入年龄" });
      return;
    }
    if (!gender) {
      Notify.open({ color: "warning", message: "请输入性别" });
      return;
    }
    await request({
      url: "/user/update",
      method: "POST",
      data: {
        name,
        avatarFileId: avatarFileId.current,
        birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
        gender: gender === "男" ? 1 : 2
      }
    });
    Notify.open({ color: "success", message: "保存成功" });
    Taro.switchTab({ url: "/pages/mine/index" });
  };

  const choose = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        setUrl(res.tempFiles[0].tempFilePath);
        upload2Server(filePath, MediaType.PICTURE, v => {
          avatarFileId.current = v.id;
        });
      }
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles.avaBox}>
        <Image
          className={styles.ava}
          onClick={choose}
          src={
            url ||
            "http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
          }
        />
      </View>
      <View className={styles.row}>
        <FieldInput
          label="儿童姓名"
          placeholder="请输入姓名"
          value={name}
          onInput={(e: any) => onNameChange(e.target.value)}
        />
      </View>
      <View className={styles.row}>
        <Picker mode="selector" range={genders} onChange={onGenderChange}>
          <ListItem left="性别" customStyles={customStyle} right={gender} />
        </Picker>
      </View>
      <View className={styles.row}>
        <Picker mode="date" value={birthday} onChange={onBirthdayChange}>
          <ListItem
            left="出生日期"
            customStyles={customStyle}
            right={birthday}
          />
        </Picker>
      </View>
      <View className={styles.btnBox}>
        <Button color="primary" className={styles.btn} onClick={save}>
          保存信息
        </Button>
      </View>
    </View>
  );
}
