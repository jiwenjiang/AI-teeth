import { Button } from "@taroify/core";
import { View } from "@tarojs/components";
import React from "react";
import styles from "./index.module.scss";

export default function Contact() {
  return (
    <View className={styles.contactBox}>
      <View>对报告有疑问？</View>
      <Button className={styles.contact} openType="contact">
        前往联系客服
      </Button>
    </View>
  );
}
