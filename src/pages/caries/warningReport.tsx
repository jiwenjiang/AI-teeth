import NavBar from "@/comps/NavBar";
import { SystemContext } from "@/service/context";
import request from "@/service/request";
import Current1 from "@/static/icons/currentGreen.svg";
import Current3 from "@/static/icons/currentRed.svg";
import Current2 from "@/static/icons/currentYellow.svg";
import Female from "@/static/icons/female.png";
import Issue from "@/static/icons/issue.svg";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Warning from "@/static/icons/warning2.svg";
import Tishi from "@/static/imgs/weixintishi.png";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import { navigateBack, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./report.module.scss";

const resultColor = {
  1: "#0051EF",
  2: "#FF6B00",
  3: "#FF0000"
};

const resultText = {
  "0": "不需要早期干预",
  "1": "可能需要早期干预",
  "2": "需要早期干预"
};

export default function App() {
  const router = useRouter();
  const { systemInfo } = useContext(SystemContext);
  const [navBarTitle] = useState(router.params.childName ?? "儿童龋齿检测");
  const [data, setData] = useState<any>({});
  const canvasBox = useRef();

  const onNavBarClick = () => {
    navigateBack();
  };

  const getAttr = async () => {
    const response = await request({
      url: "/check/get",
      data: { id: router.params.id || 74 }
    });
    setData(response.data);
  };

  useEffect(() => {
    getAttr();
  }, []);

  return (
    <View className="page">
      <NavBar title={navBarTitle} back={onNavBarClick} />
      <View className={styles.body}>
        <View className={styles.tipBox}>
          <View className={styles.tip}>
            <View>
              <Text className={styles.name}>{data?.children?.name}</Text>
              <Image
                className={styles.gender}
                src={data?.children?.gender === 1 ? Male : Female}
                mode="widthFix"
              />
              <Text className={styles.age}>{data?.children?.age}岁</Text>
            </View>
            <Text className={styles.time}>{data?.children?.birthday}</Text>
          </View>
        </View>
        <ScrollView
          className={styles.content}
          scrollY
          style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 106px)` }}
          ref={canvasBox}
        >
          <View className={styles.warningResult}>
            <View className={styles.warningHead}>
              {resultText[data.result]}
            </View>
            <View className={styles.warningStatusBox}>
              <View className={cls(styles.warningLine)}>
                {data.result === "0" && (
                  <Image src={Current1} className={cls(styles.line)} />
                )}
              </View>
              <View className={styles.warningLine}>
                {data.result === "1" && (
                  <Image src={Current2} className={cls(styles.line)} />
                )}
              </View>
              <View className={styles.warningLine}>
                {data.result === "2" && (
                  <Image src={Current3} className={cls(styles.line)} />
                )}
              </View>
            </View>
            <View className={styles.warningTip}>
              <Image src={Warning} className={styles.warningIcon} />
              <Text>
                您目前{data.result === "0" ? "无" : "有"}表现出症状，
                {resultText[data.result]}
              </Text>
            </View>
          </View>
          <View className={styles.warningRefer}>
            <Image className={styles.tishi} src={Tishi} />
            <Text className={styles.tishitext}>治疗方案</Text>
            <View className={styles.resultBody}>
              <View>{data?.treatment}</View>
              <View className={styles.desc}>
                <Image className={styles.icon} src={Voice} />
                (以上治疗方案为辅助判断，具体方案请以牙科医生检查结果为准）。
              </View>
            </View>
          </View>
          <View className={styles.warningList}>
            <View className={styles.listHead}>
              <View className={styles.border}></View>
              <View className={styles.titleBox}>
                <Image src={Issue} className={styles.issue}></Image>
                <Text className={styles.issueText}>List of issues</Text>
                <View className={styles.title}>问题清单</View>
              </View>
              <View className={styles.hLine}></View>
              <View className={styles.dot}></View>
            </View>
            <View className={styles.listBody}>
              {data?.problems?.map((v, i) => (
                <View key={i} className={styles.listItem}>
                  <View className={styles.itemBg}>{v}</View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        {/* <View className={cls(styles.btn)} onClick={submit}>
          开始检测
        </View> */}
      </View>
    </View>
  );
}
