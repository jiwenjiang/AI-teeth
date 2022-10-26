import Contact from "@/comps/Contact";
import NavBar from "@/comps/NavBar";
import Report from "@/comps/Report";
import { useReportBtnHandle } from "@/service/hook";
import request from "@/service/request";
import fenxiImg from "@/static/imgs/fenxi.png";
import introImg from "@/static/imgs/intro.png";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Button, Dialog, Popup } from "@taroify/core";
import { InfoOutlined } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./brainDetail.module.scss";

const colorMap = {
  低风险: "#2EC25B",
  中等风险: "#FF7D41",
  高风险: "#EBEDF0"
};

const riskMap = {
  "1": {
    text: "无高危无异常",
    color: "#2EC25B"
  },
  "2": {
    text: "有高危无异常",
    color: "#1989fa"
  },
  "3": {
    text: "无高危有异常",
    color: "#f44336"
  },
  "4": {
    text: "有高危有异常",
    color: "#f44336"
  }
};

const intros = [
  {
    title: "1、正常扭动运动（N）：【扭动阶段】",
    content:
      "出现在足月至足月后6~9周龄内。其特征为小至中等幅度，速度缓慢至中等，运动轨迹在形式上呈现为椭圆体，给人留下扭动的印象。"
  },
  {
    title: "2、正常不安运动（F+）：【不安阶段】",
    content:
      "是一种小幅度中速运动，遍布颈、躯干和四肢,发生在各个方向，运动加速度可变，在清醒婴儿中该运动持续存在(哭闹时除外)，通常在足月后9周龄左右出现。早产儿可在矫正年龄足月后6周龄左右出现不安运动。不安运动出现的频度随年龄而发生改变，一般可以分为：①连续性不安运动：指不安运动时常出现,间以短时间暂停。不安运动发生在整个身体，尤其在颈、躯干、肩、腕、髋和踝部。不安运动在不同身体部位的表现可能不同，取决于身体姿势尤其是头部位置。②间歇性不安运动：指不安运动之间的暂停时间延长，令人感觉到不安运动在整个观察时期内仅出现一半。③偶发性不安运动：不安运动之间的暂停时间更长。"
  }
];

const intros2 = [
  {
    title: "1、单调性（PR）：【扭动阶段】",
    content:
      "表现为宝宝连续性运动顺序的单调，不同身体部位的运动失去了正常的GMS复杂性，总是简单的重复几个动作。存在一定的神经运动发育障碍风险。"
  },
  {
    title: "2、痉挛－同步性（CS）：【扭动阶段】",
    content:
      "扭动运动阶段出现运动僵硬，失去正常的流畅性，所有肢体和躯干肌肉几乎同时收缩和放松，比如双腿同时抬高并且同时放下。存在神经运动发育障碍风险。"
  },
  {
    title: "3、混乱型（CH）：【扭动阶段】",
    content:
      "扭动运动阶段出现肢体运动幅度大，顺序混乱，失去流畅性，动作突然不连贯。“混乱型”相当少见，常在数周后发展为“痉挛－同步性”GMs。存在神经运动发育障碍风险。"
  },
  {
    title: "4、不安运动缺乏（F-）：【不安阶段】",
    content:
      "不安运动是一种小幅度，中速度的细微运动，在9-20周龄的宝宝身上会如星辰般闪烁的各个的身体部位上。如果没有这样的细微运动出现，便是不安运动缺乏了。存在神经运动发育障碍风险。"
  },
  {
    title: "5、异常不安运动 （AF）：【不安阶段】",
    content:
      "看起来与正常不安运动相似，但在动作幅度、速度以及不平稳性方面中度或明显夸大。该异常模式少见, 并且预测价值低。"
  }
];

const checkColor = v => {
  if (v) {
    return colorMap[v];
  } else {
    return "#000000";
  }
};

const checkItem = v => {
  if (v) {
    return riskMap[v];
  } else {
    return {};
  }
};

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
  const [popObj, setPopObj] = useState({ visible: false, content: "" });
  const { checkPay, toPay, open, setOpen, price } = useReportBtnHandle();
  const [intro, setIntro] = useState(false);

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

  const handle = c => {
    if (c.type === "STRING") {
      setPopObj({ visible: true, content: c.content });
    }
    if (c.type === "MINIAPP") {
      checkPay(c);
    }
    if (c.type === "SELF") {
      checkPay(c, true);
    }
  };

  return (
    <View>
      <NavBar title="脑瘫+GMs评估详情" />
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
                    &nbsp; 蕾波自测测评结果
                  </View>
                  <View className={styles.scoreBox}>
                    <View className={styles.text}>您本次评测结果风险系数</View>
                    <View
                      className={styles.score}
                      style={{ color: checkColor(data.content) }}
                    >
                      {data.score}%
                    </View>
                  </View>
                </View>
              </View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 蕾波自测结果分析
                  </View>
                  <View className={styles.remark}>
                    <View>
                      蕾波幼儿脑瘫危险程度百分数表自测结果风险系数越高，则患儿童脑损伤的可能性越大。测评结果不代表诊断结果，建议您联系客服预约蕾波专业评估，进一步精准评定！
                    </View>
                    <View className={styles.kefu}>
                      <Text className={styles.key}>客服咨询预约电话</Text>
                      <Text className={styles.val}>400-898-6962</Text>
                    </View>
                    <View className={styles.kefu}>
                      <Text className={styles.key}>附近中心预约评估</Text>
                      <Text className={styles.val}>400-898-6962</Text>
                    </View>
                    <View className={styles.kefu}>
                      <Text className={styles.key}>总部联系电话</Text>
                      <Text className={styles.val}>400-898-6962</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 蕾波自测医学评估
                    <Text className={styles.evaDate}>
                      {report.evaluateDate}
                    </Text>
                  </View>
                  <View>
                    {report?.progressStatus === "未评估" ? (
                      "医学评估后可查看评估结果，可以通过微信的服务消息或者在【我的】-【自测量表记录】中查看报告结果"
                    ) : (
                      <View className={styles.evaBox}>
                        {report?.scaleResult?.cerebralPalsyResult?.result && (
                          <View
                            className={styles.tag}
                            style={{
                              backgroundColor:
                                checkItem(
                                  report?.scaleResult?.cerebralPalsyResult
                                    ?.result
                                )?.color ?? "#000"
                            }}
                          >
                            {
                              checkItem(
                                report?.scaleResult?.cerebralPalsyResult?.result
                              )?.text
                            }
                          </View>
                        )}

                        <View className={styles.tagBox}>
                          {report.scaleResult?.cerebralPalsyResult?.highRisk?.map(
                            v => (
                              <View className={styles.grayTag}>{v}</View>
                            )
                          )}
                        </View>
                        <View className={styles.evaRemark}>
                          {report.scaleResult?.cerebralPalsyResult?.remark}
                        </View>
                        <View className={styles.evaConclusion}>
                          {report.conclusion}
                        </View>
                        <View className={styles.tagBox}>
                          {report.scaleResult?.cerebralPalsyResult?.abnormalIterm?.map(
                            v => (
                              <View className={styles.grayTag}>{v}</View>
                            )
                          )}
                        </View>
                        <View className={styles.mt20}>
                          <View className={styles.intro}>
                            评估结果不代表诊断结果
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {/* <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={pingceImg} className={styles.imgIcon} />
                    &nbsp; GMs测评结果
                  </View>
                </View>
              </View> */}
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; GMs医学评估{" "}
                    <InfoOutlined
                      size={17}
                      style={{ marginLeft: 5 }}
                      color="#1989fa"
                      onClick={() => setIntro(true)}
                    />
                    <Text className={styles.evaDate}>
                      {report.evaluateDate}
                    </Text>
                  </View>
                  <View className={styles.gmsEvaBox}>
                    {report.scaleResult?.gmsResult?.result?.map(
                      (v, i) =>
                        v.content && (
                          <View key={i} className={styles.evaItem}>
                            <View className={styles.evaTitle}>{v.name}</View>
                            <View className={styles.evaVal}>{v.content}</View>
                          </View>
                        )
                    )}
                  </View>
                  <View className={cls(styles.evaBox, styles.evaBox2)}>
                    <View className={styles.evaRemark}>
                      {report.scaleResult?.gmsResult?.remark}
                    </View>
                    <View className={styles.intro}>评估结果不代表诊断结果</View>
                  </View>
                </View>
              </View>
              {report.scaleResult?.cerebralPalsyResult?.suggest?.map((v, i) => (
                <View className={styles.cardBox} key={i}>
                  <View className={styles.card}>
                    <View className={styles.title}>
                      <Image src={pingceImg} className={styles.imgIcon} />
                      &nbsp; 建议{i + 1}
                    </View>
                    <View className={styles.cardContent}>{v.content}</View>
                    {v.button?.map(c => (
                      <Button
                        className={styles.btnBox}
                        variant="outlined"
                        color="primary"
                        onClick={() => handle(c)}
                      >
                        {c.copyWriting}
                      </Button>
                    ))}
                  </View>
                </View>
              ))}
              <Report data={report} />
            </View>
          )}
        </View>
      )}

      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setPopObj({ visible: false, content: "" })}
        open={popObj.visible}
      >
        <View className={styles.popContent}>{popObj.content}</View>
      </Popup>
      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setIntro(false)}
        open={intro}
      >
        <View>
          <Image src={introImg} className={styles.introImg} />
        </View>
        <View className={styles.introBox}>
          全身运动（GMs）是最常出现和最复杂的一种自发性运动模式，最早出现于妊娠9周的胎儿，持续至出生后5~6个月，能够十分有效地评估年幼神经系统的功能。GMs指整个身体参与的运动，臂、腿、颈和躯干以变化运动顺序的方式参与，这种GMs在运动强度、力量和速度方面具有高低起伏的变化，运动的开始和结束都具有渐进性。沿四肢轴线的旋转和运动方向的轻微改变使整个运动流畅优美并产生一种复杂多变的印象。
        </View>
        <View className={styles.introBox}>
          GMs按时间的发育历程包括：足月前GMs（foetal and preterm
          GMs，即胎儿和早产儿阶段），扭动运动（writhing
          movements，WMs，即从足月至足月后6~9周龄）和不安运动（fidgety
          movements，FMs，即足月后6~9周龄至5~6月龄）。
        </View>
        <View className={styles.introBox}>其中正常GMs主要有：</View>
        {intros.map(v => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
        <View className={styles.introBox}>其中异常的GMs主要包括：</View>
        {intros2.map(v => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
      </Popup>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Header>购买视频课程</Dialog.Header>
        <Dialog.Content>
          购买视频课程后，享有蕾波所有线上视频课程均可免费观看权益
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => toPay()}>{price ?? 0}元立即购买</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
