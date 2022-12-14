import React, { useEffect, useState } from "react";

import { Button, Popup } from "@taroify/core";
import { Cross } from "@taroify/icons";
import { Icon, Image, Text, View } from "@tarojs/components";
import Taro, { navigateTo, reLaunch, useRouter } from "@tarojs/taro";

import CustomButton from "@/comps/CustomButton";
import NavBar from "@/comps/NavBar";

import { tabPages } from "@/service/const";
import { useAuth } from "@/service/hook";
import request from "@/service/request";

import styles from "./index.module.scss";

import logo from "@/static/imgs/login-logo.png";

export default function App() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const { getAuth } = useAuth();

  useEffect(() => {
  }, []);

  const showTerms = (page: 'user' | 'privacy') => {
    navigateTo({
      url: `/packages/login/terms?category=${page}`,
    })
  };

  const onGetPhoneNumber = async (e) => {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();

    // 用微信code登陆，检查有没有绑定手机号
    const res = await request({
      url: "/miniapp/login",
      method: "POST",
      data: {
        code: login.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        phoneCode: e.detail.code
      }
    });

    // 没有绑定手机号的话用 getAuth 登录
    if (res.code === 0) {
      getAuth();
      if (router.params.returnUrl) {
        if (tabPages.includes(router.params.returnUrl)) {
          Taro.switchTab({ url: router.params.returnUrl });
        } else {
          reLaunch({ url: router.params.returnUrl });
        }
      } else {
        Taro.switchTab({ url: "/pages/index/index" });
      }
    }
  };

  const sure = () => {
    setPopupOpen(false);
    setAgree(true);
  };

  const btnStyles = {
    width: '223px',
    marginTop: '30px',
  }

  return (
    <View className={styles.page}>
      <NavBar title={''} showIcon={false} back={undefined} />
      <View className={styles.content}>
        <View className={styles.top}></View>
        <View className={styles.center}>
          {/* taro 设置图片高度
          https://github.com/NervJS/taro/issues/685
          https://developers.weixin.qq.com/miniprogram/dev/component/image.html */}
          <Image src={logo} className={styles.logo} mode="widthFix" />
        </View>
        <View className={styles.bottom}>
          <View className={styles.button}>
            <Button
              className={styles.loginbutton}
              color="primary"
              openType="getPhoneNumber"
              onGetPhoneNumber={onGetPhoneNumber}
            >
              微信授权一键登录
            </Button>
            {!agree && (
              <View
                className={styles.btnmask}
                onClick={() => setPopupOpen(true)}
              ></View>
            )}
          </View>
          <View className={styles.agree} onClick={() => setAgree(!agree)}>
            {agree ? <Icon type='success' size='16' />
              : <Icon type='circle' size='16' />}
            <Text className={styles.agreetext}>我已阅读并同意</Text>
            {/* Text 组件 onClick 事件无效，得用 View 组件 */}
            <View className={styles.link} onClick={() => showTerms('user')}>《用户协议》</View>
            和
            <View className={styles.link} onClick={() => showTerms('privacy')}>《隐私协议》</View>
          </View>
        </View>
        <Popup
          placement="bottom"
          open={popupOpen}
          rounded
          onClose={() => setPopupOpen(false)}
        >
          <View className={styles.popupwrapper}>
            <View className={styles.content}>
              <View className={styles.close}>
                <Cross size='15px' color="#aaa" onClick={() => setPopupOpen(false)} />
              </View>
              <Text className={styles.title}>阅读并同意以下条款</Text>
              <View className={styles.links}>
                <View className={styles.link} onClick={() => showTerms('user')}>《用户协议》</View>
                <View className={styles.link} onClick={() => showTerms('privacy')}>《隐私协议》</View>
              </View>
              <CustomButton styles={btnStyles} text={'同意并继续'} click={sure} />
            </View>
          </View>
        </Popup>
      </View>
    </View>
  );
}
