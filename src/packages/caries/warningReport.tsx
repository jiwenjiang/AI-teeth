import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
} from "@tarojs/components";
import {
  getCurrentPages,
  navigateBack,
  useRouter,
  switchTab,
} from "@tarojs/taro";

import NavBar from "@/comps/NavBar";
import Share from "@/comps/Share";

import { SystemContext } from "@/service/context";
import request from "@/service/request";
import { cls } from "reactutils";

import dayjs from "dayjs";

import Current1 from "@/static/icons/currentGreen.svg";
import Current3 from "@/static/icons/currentRed.svg";
import Current2 from "@/static/icons/currentYellow.svg";
import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Tishi from "@/static/imgs/weixintishi.png";

import styles from "./report.module.scss";

const resultText = {
  "-2": "检测中",
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
    const currentPages = getCurrentPages();
    if (
      currentPages.length > 1 &&
      currentPages[currentPages.length - 2].route.includes(
        "packages/caries/photo"
      )
    ) {
      navigateBack({
        delta: 2
      });
    } else if (currentPages.length > 1) {
      navigateBack();
    } else {
      switchTab({
        url: "/pages/index/index"
      });
    }
  };

  const getAttr = async () => {
    const response = await request({
      url: "/check/get",
      data: { id: router.params.id || 74 }
    });
    setData({
      ...response.data,
      problems: response.data.problems.filter((v: any) => v)
    });
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
              <Text className={styles.age}>{dayjs().diff(dayjs(data?.children?.birthday), 'year')}岁</Text>
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
          </View>
          <View className={styles.warningRefer}>
            <Image className={styles.tishi} src={Tishi} />
            <Text className={styles.tishitext}>治疗方案</Text>
            <View className={styles.resultBody}>
              <View>{data?.treatment}</View>
              <View className={styles.desc}>
                <Image className={styles.icon} src={Voice} />
                （测量结果仅供参考，具体结果请以口腔医生检查结果为准。）
              </View>
            </View>
          </View>
          {/* <View className={styles.warningList}>
            <View className={styles.listHead}>
              <View className={styles.border}></View>
              <View className={styles.titleBox}>
                <Image
                  src={Issue}
                  mode="widthFix"
                  className={styles.issue}
                ></Image>
                <Text className={styles.issueText}>问题清单</Text>
              </View>
              <View className={styles.hLine}></View>
              <View className={styles.dot}></View>
            </View>
            <View className={styles.listBody}>
              {data?.problems?.length > 0 ? (
                data.problems.map((v, i) => (
                  <View key={i} className={styles.listItem}>
                    <View className={styles.itemBg}>{v}</View>
                  </View>
                ))
              ) : (
                <View className={styles.noProblem}>牙齿情况正常</View>
              )}
            </View>
          </View> */}
        </ScrollView>
        <Share report={2} />
      </View>
    </View>
  );
}
