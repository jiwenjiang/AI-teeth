import { View } from "@tarojs/components";
import React, { CSSProperties } from "react";
import "./index.scss";

export default function CustomButton({
  text,
  classes,
  styles,
  click
}: {
  text?: React.ReactNode;
  classes?: String;
  styles?: CSSProperties;
  click?: Function;
}) {
  const handle = () => {
    click?.();
  };
  
  return (
    <View className={`custom-button ${classes}`} style={styles} onClick={handle}>
      {text}
    </View>
  );
}
