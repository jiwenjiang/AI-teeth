import Contact from "@/comps/Contact";
import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import fenxiImg from "@/static/imgs/fenxi.png";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Image, Text, View } from "@tarojs/components";
import { openCustomerServiceChat, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./brainDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const [report, setReportData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleRecord/get",
        data: { id: router.params.id || 1 }
      });
      setData(res.data);
      const res2 = await request({
        url: "/scaleRecord/report",
        data: { id: router.params.id }
      });
      setReportData(res2.data);
    })();
  }, []);

  const goto = () => {
    // navigateTo({
    //   url: `/pages/evaluate/index?childId=${1}&age=${data[active]?.birthdayDate}&code=${router.params.code}`
    // });
  };

  const cs = () => {
    openCustomerServiceChat();
  };

  return (
    <View>
      <NavBar title="GMs评估详情" />
      <Contact />
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={yonghuImg} className={styles.imgIcon} />
            &nbsp; 用户详情
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>姓名</Text>
            <Text className={styles.v}>{data.name}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>性别</Text>
            <Text className={styles.v}>{data.gender}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>年龄</Text>
            <Text className={styles.v}>{data.age}</Text>
          </View>
        </View>
      </View>
      {report?.progressStatus && (
        <View>
          {report?.progressStatus === "未评估" ? (
            <View className={styles.noEva}>
              <View>已提交医学评估，请耐心等待，</View>
              <View>医学评估后将通知您</View>
              <View className={styles.phone}>客服电话：400-898-6862</View>
            </View>
          ) : (
            <View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={pingceImg} className={styles.imgIcon} />
                    &nbsp; 测评结果
                  </View>
                  <View className={styles.gmsEvaBox}>
                    {report.scaleResult?.result?.map((v, i) => (
                      <View key={i} className={styles.evaItem}>
                        <View className={styles.evaTitle}>{v.name}</View>
                        <View className={styles.evaVal}>{v.content}</View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 医学评估
                    <Text className={styles.evaDate}>
                      {report.evaluateDate}
                    </Text>
                  </View>
                  <View className={styles.evaBox}>
                    <View>{report.conclusion}</View>
                    <View className={styles.intro}>评估结果不代表诊断结果</View>
                  </View>
                </View>
              </View>
              {/* <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 孩子的评估结果有风险，缺乏治疗方案？
                  </View>
                  <Button
                    className={styles.btnBox}
                    variant="outlined"
                    color="primary"
                    onClick={() => goto()}
                  >
                    免费定制专属治疗方案
                  </Button>
                </View>
              </View> */}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
