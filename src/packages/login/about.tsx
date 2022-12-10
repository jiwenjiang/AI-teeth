import React, { CSSProperties } from "react";

import NavBar from "@/comps/NavBar";
import { View, RichText } from "@tarojs/components";
import { navigateBack } from "@tarojs/taro";

import { About } from '@/service/richtexts';

import styles from "./about.module.scss";

export default function App() {
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
        title={'关于我们'}
        customNavBarStyles={customNavBarStyles}
        customNavIconStyles={customNavIconStyles}
        back={back}
      />
      <View className={styles.content}>
        <View className={styles.textwrapper}>
          <View className={styles.texts}>
            <RichText nodes={About} />
          </View>
        </View>
      </View>
    </View>
  );
}
