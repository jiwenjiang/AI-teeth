import fenxiImg from "@/static/imgs/fenxi.png";
import { Image, Text, View } from "@tarojs/components";
import React from "react";
import styles from "./index.module.scss";

export default function Report({ data }: any) {
  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.title}>
          <Image src={fenxiImg} className={styles.imgIcon} />
          &nbsp; 量表信息
        </View>
        <View className={styles.kv2}>
          <Text className={styles.k}>量表名称：</Text>
          <Text className={styles.v}>{data.scaleTableName}</Text>
        </View>
        <View className={styles.kv2}>
          <Text className={styles.k}>筛查时间：</Text>
          <Text className={styles.v}>{data.created}</Text>
        </View>
        <View className={styles.kv2}>
          <Text className={styles.k}>自筛得分：</Text>
          <Text className={styles.v}>{data.userScore}</Text>
        </View>
        <View className={styles.kv2}>
          <Text className={styles.k}>医学评估：</Text>
          <Text className={styles.v}>{data.doctorScore}</Text>
        </View>
        <View className={styles.table}>
          <View className={styles.head}>
            <View className={styles.col1}>题目</View>
            <View className={styles.col2}>自筛选择</View>
            <View className={styles.col2}>自筛得分</View>
            <View className={styles.col2}>医学评估</View>
          </View>
          <View className={styles.body}>
            {data.answers?.map((v, i) => (
              <View key={i} className={styles.li}>
                <View className={styles.col1}>{v.name}</View>
                <View className={styles.col2}>{v.answer}</View>
                <View className={styles.col2}>{v.userScore}</View>
                <View className={styles.col2}>{v.doctorScore}</View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
