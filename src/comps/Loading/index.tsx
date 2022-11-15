import { Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import React, { ReactNode } from "react";
import styles from "./index.module.scss";

export default function MaskLoading({
  visible,
  text
}: {
  visible: boolean;
  text?: ReactNode;
}) {
  return visible ? (
    <View className={styles.loadingBox}>
      <Loading size="40px" className={styles.loading} direction="vertical">
        {text}
      </Loading>
    </View>
  ) : null;
}
