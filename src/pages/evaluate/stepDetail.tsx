import Contact from "@/comps/Contact";
import NavBar from "@/comps/NavBar";
import { ScaleTableCode } from "@/service/const";
import { useReportBtnHandle } from "@/service/hook";
import request from "@/service/request";
import DoctorIcon from "@/static/icons/doctor.svg";
import noticeIcon from "@/static/icons/notice.svg";
import fenxiImg from "@/static/imgs/fenxi.png";
import introImg from "@/static/imgs/intro.png";
import leiboImg from "@/static/imgs/leibo.jpg";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Button, Dialog, Popup } from "@taroify/core";
import { Down, InfoOutlined } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./brainDetail.module.scss";

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
      if (ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode) {
        const obj = {
          ...res2.data,
          scaleResult: { cerebralPalsyResult: res2.data.scaleResult }
        };
        setReportData(obj);
      } else {
        setReportData(res2.data);
      }
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

  const downloadImg = async () => {
    const res = await request({
      url: "/scaleRecord/report/picture",
      data: { id: router.params.id }
    });
    preview(res?.data, 0);
  };

  const preview = (urls, e) => {
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e
    });
  };

  return (
    <View>
      <NavBar title={report?.scaleTableName} />
      <Contact />

      {report?.progressStatus && (
        <View>
          {report?.progressStatus === "未评估" ? (
            <View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={noticeIcon} className={styles.imgIcon} />
                    &nbsp; 温馨提示
                  </View>
                  <View className={styles.noEvaluete}>
                    <View>
                      已提交医学评估，请耐心等待，医学评估后，您可以收到微
                      信服务通知或者在【我的】-【自测量表记录】查看结果
                    </View>
                    <View className={styles.phone}>客服电话：400-898-6862</View>
                  </View>
                </View>
              </View>

              <Info data={data} />
            </View>
          ) : (
            <View className={styles.pb20}>
              <Info data={data} />
              {report?.scaleTableCode === ScaleTableCode.LEIBO_GMS && (
                <View className={styles.cardBox}>
                  <View className={styles.card}>
                    <View className={styles.title}>
                      <Image src={leiboImg} className={styles.imgIcon} />
                      &nbsp; 全身运动质量评估GMs
                      <InfoOutlined
                        size={17}
                        style={{ marginLeft: 5 }}
                        color="#1989fa"
                        onClick={() => setIntro(true)}
                      />
                    </View>
                    <View className={styles.pb20}>
                      {report.scaleResult?.gmsResult?.result?.map(
                        (v, i) =>
                          v.content && (
                            <View className={styles.brainBox}>
                              <View className={styles.brain1} key={i}>
                                <View className={styles.brainTitle}>
                                  {v.name}
                                </View>
                                <View className={styles.brainVal}>
                                  {v.content}
                                </View>
                              </View>
                            </View>
                          )
                      )}
                    </View>
                  </View>
                </View>
              )}

              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={leiboImg} className={styles.imgIcon} />
                    &nbsp; 蕾波婴幼儿脑瘫危险程度
                  </View>
                  <View className={styles.brainBox}>
                    <View className={styles.brain1}>
                      <View className={styles.brainTitle}>
                        儿童脑瘫危险程度
                      </View>
                      <View className={styles.brainVal}>
                        {
                          report?.scaleResult?.cerebralPalsyResult
                            ?.cerebralPalsyScore
                        }
                      </View>
                    </View>
                    <View className={styles.brainBox2}>
                      <View className={styles.brain2}>
                        <View className={styles.brainTitle}>高危因素</View>
                        <View className={styles.brainRisk}>
                          {report?.scaleResult?.cerebralPalsyResult
                            ?.haveHighRisk
                            ? "有"
                            : "无"}
                        </View>
                      </View>
                      <View className={styles.brain2}>
                        <View className={styles.brainTitle}>
                          姿势和运动异常
                        </View>
                        <View className={styles.brainRisk}>
                          {report?.scaleResult?.cerebralPalsyResult
                            ?.haveAbnormalIterm
                            ? "有"
                            : "无"}
                        </View>
                      </View>
                    </View>
                    <View className={styles.doctorBox}>
                      <Image src={DoctorIcon} className={styles.doctor}></Image>
                      <View className={styles.doctorDesc}>
                        <View className={styles.firstLine}>
                          请带宝宝到线下机构做专业评估
                        </View>
                        <View>以免影响孩子的发育</View>
                        <View className={styles.doctorTip}>
                          评估结果不代表诊断结果
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 结果解读
                    <Down className={styles.downLoad} onClick={downloadImg} />
                  </View>
                  <View>
                    <View
                      className={cls(
                        styles.evaBox,
                        styles.noMargin,
                        styles.pb20
                      )}
                    >
                      <View className={styles.evaRemark}>
                        您的宝宝生长发育存在高危因素
                      </View>
                      <View className={styles.tagBox}>
                        {report.scaleResult?.cerebralPalsyResult?.highRisk?.map(
                          v => (
                            <View className={styles.grayTag}>{v}</View>
                          )
                        )}
                      </View>
                      <View className={styles.evaRemark}>
                        您的宝宝生长发育存在姿势和运动异常
                      </View>

                      <View className={styles.tagBox}>
                        {report.scaleResult?.cerebralPalsyResult?.abnormalIterm?.map(
                          v => (
                            <View className={styles.grayTag}>{v}</View>
                          )
                        )}
                      </View>
                    </View>
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
              <View className={cls(styles.cardBox, styles.mb20)}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={fenxiImg} className={styles.imgIcon} />
                    &nbsp; 量表评估信息
                  </View>
                  <View className={styles.kv}>
                    <Text className={styles.k}>量表名称</Text>
                    <Text className={styles.v}>{report?.scaleTableName}</Text>
                  </View>
                  <View className={styles.kv}>
                    <Text className={styles.k}>筛查时间</Text>
                    <Text className={styles.v}>{report?.evaluateDate}</Text>
                  </View>
                  <View className={styles.kv}>
                    <Text className={styles.k}>评估人</Text>
                    <Text className={styles.v}>{report?.name}</Text>
                  </View>
                  <View className={cls(styles.head, styles.headTxt)}>
                    <View className={styles.head1}>姿势和运动异常</View>
                    <View>医学评估</View>
                  </View>
                  {report?.scaleResult?.cerebralPalsyResult?.positionAndSportAbnormal?.map(
                    (v, i) => (
                      <View key={i} className={styles.head}>
                        <View className={styles.head2}>{v.name}</View>
                        <View
                          className={cls(
                            styles.succ,
                            v.status === 1 && styles.error
                          )}
                        >
                          {v.status === 1 ? "异常" : "正常"}
                        </View>
                      </View>
                    )
                  )}
                  <View></View>
                </View>
              </View>
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

function Info({ data }) {
  return (
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
          <Text className={styles.k}>出生日期</Text>
          <Text className={styles.v}>{data.birthday}</Text>
        </View>
        <View className={styles.kv}>
          <Text className={styles.k}>出生孕期</Text>
          <Text className={styles.v}>{data.gestationalWeek}</Text>
        </View>
        <View className={styles.kv}>
          <Text className={styles.k}>出生体重</Text>
          <Text className={styles.v}>{data.birthdayWeight}</Text>
        </View>
        <View className={styles.kv}>
          <Text className={styles.k}>年龄</Text>
          <Text className={styles.v}>{data.age}</Text>
        </View>
        <View className={styles.kv}>
          <Text className={styles.k}>检查日期</Text>
          <Text className={styles.v}>{data.created}</Text>
        </View>
      </View>
    </View>
  );
}
