import React, { CSSProperties, useEffect, useState } from "react";

import NavBar from "@/comps/NavBar";
import { RichText, View } from "@tarojs/components";
import { navigateBack, useRouter } from "@tarojs/taro";

import CustomButton from "@/comps/CustomButton";

import { TermOfPrivacy, TermOfUser } from '@/service/richtexts';

import styles from "./terms.module.scss";

export default function App() {
  const router = useRouter();
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (router.params.category) {
      setCategory(router.params.category);
    }
  }, []);

  const back = () => {
    navigateBack();
  };

  const customNavBarStyles: CSSProperties = {
    backgroundColor: '#f8f8f8',
    fontSize: '17px',
    color: '#000',
  };

  const customNavIconStyles: CSSProperties = {
    filter: 'invert(1)',
    marginRight: "22px",
  };

  return (
    <View className={styles.page}>
      <NavBar
        title={'用户协议'}
        customNavBarStyles={customNavBarStyles}
        customNavIconStyles={customNavIconStyles}
        back={back}
      />
      <View className={styles.content}>
        <View className={styles.textwrapper}>
          <View className={styles.texts}>
            <RichText nodes={category === 'user' ? TermOfUser : TermOfPrivacy} />
          </View>
        </View>
        <CustomButton classes={'iknow'} text={'知道了'} click={back} />
      </View>
    </View>
  );
}
