import { View } from "@tarojs/components";
import React, { CSSProperties } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

export default function Steper({
  activeIndex,
  change,
  list,
  extendStyle
}: {
  list: Record<"label" | "desc", string>[];
  activeIndex: number;
  change?: Function;
  extendStyle?: CSSProperties;
}) {
  return (
    <View className={cls(styles.box)} style={extendStyle}>
      {list?.map((v, i) => (
        <View key={i} className={cls(styles.item, i === 0 && styles.first)}>
          {i !== 0 && (
            <View
              className={cls(
                styles.line,
                activeIndex >= i && styles.activeLine
              )}
            ></View>
          )}
          <View className={cls(styles.num)}>
            <View
              className={cls(
                styles.icon,
                activeIndex > i && styles.complated,
                activeIndex === i && styles.activeIcon
              )}
            >
              {i + 1}
            </View>
            <View className={styles.label}>{v.label}</View>
            <View className={styles.desc}>{v.desc}</View>
          </View>
        </View>
      ))}
    </View>
  );
}
