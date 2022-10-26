import FieldInput from "@/comps/Field";
import TabBar from "@/comps/TabBar";
import request from "@/service/request";
import { Button, Notify } from "@taroify/core";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React, { useState } from "react";
import "./password.scss";

export default function App() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onPasswordChange = value => {
    console.log("🚀 ~ file: password.tsx ~ line 15 ~ App ~ value", value);
    setPassword(value);
  };

  const onConfirmPasswordChange = value => {
    setConfirmPassword(value);
  };

  const onFinish = async () => {
    if (password !== confirmPassword) {
      Notify.open({
        color: "warning",
        message: "两次输入的密码不一致，请重新输入"
      });
      return;
    }

    await request({
      url: "/password/update",
      method: "POST",
      data: {
        password
      }
    });
    Notify.open({
      color: "success",
      message: "密码修改成功"
    });

    await new Promise(r => setTimeout(r, 3000));

    navigateTo({
      url: `/pages/mine/setting`
    });
  };

  return (
    <View className="password">
      <View className="row">
        <FieldInput
          label="新密码"
          placeholder="请输入新密码"
          value={password}
          type="safe-password"
          onInput={(e: any) => onPasswordChange(e.target.value)}
        />
      </View>
      <View className="row">
        <FieldInput
          label="确认密码"
          placeholder="请再次输入新密码"
          value={confirmPassword}
          type="safe-password"
          onInput={(e: any) => onConfirmPasswordChange(e.target.value)}
        />
      </View>
      <View className="actions">
        <Button onClick={() => onFinish()} className="action confirm">
          确认修改
        </Button>
      </View>
      <TabBar current="mine" />
      <Notify id="notify" />
    </View>
  );
}
