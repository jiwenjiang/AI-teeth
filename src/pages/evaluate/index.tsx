import NavBar from "@/comps/NavBar";
import { MediaType, ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import AudioSvg from "@/static/icons/audio.svg";
import StopSvg from "@/static/icons/stop.svg";
import { Button, Loading, Notify, Radio, Textarea } from "@taroify/core";
import {
  Clear,
  PauseCircleOutlined,
  PhotoOutlined,
  PlayCircleOutlined,
  VideoOutlined
} from "@taroify/icons";
import {
  Form,
  Image,
  Swiper,
  SwiperItem,
  Video,
  View
} from "@tarojs/components";
import {
  createInnerAudioContext,
  createVideoContext,
  getRecorderManager,
  InnerAudioContext,
  navigateTo,
  RecorderManager,
  useRouter
} from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

const transTitle = e => {
  return {
    [ScaleTableCode.GMS]: "GMs评测",
    [ScaleTableCode.BRAIN]: "脑瘫评测",
    [ScaleTableCode.BRAIN_GMS]: "脑瘫+GMs评测"
  }[e];
};

export default function App() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [active, setActive] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [btnText, setBtnText] = useState("提交答案");
  const recorderManager = useRef<RecorderManager>();
  const innerAudioContext = useRef<InnerAudioContext>();
  const [title] = useState(transTitle(Number(router.params.code)));

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: { code: router.params.code ?? 9, birthday: router.params.age ?? 0 }
    });
    const datas = res.data.subjects?.map(v => ({
      ...v,
      questions: v.questions?.map(c => ({
        ...c,
        remark: "",
        attachments: [],
        mediaList: [],
        answerSn: 1
      }))
    }));
    setData(datas);
  };

  useEffect(() => {
    getList();
  }, []);

  const pre = () => {
    if (questionIndex === 0) {
      setActive(active - 1);
      setQuestionIndex(data[active - 1].questions.length - 1);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const next = () => {
    if (
      data[active].questions[questionIndex]?.mediaList?.length === 0 &&
      data[active].questions[questionIndex]?.answerSn !== 1
    ) {
      Notify.open({
        color: "warning",
        message: "请至少上传一个视频或图片"
      });
      return;
    }
    if (questionIndex < data[active].questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setActive(active + 1);
      setQuestionIndex(0);
    }
  };

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  const mediaList = ({ type, filePath, thumbTempFilePath }) => {
    if (data[active].questions[questionIndex].mediaList) {
      data[active].questions[questionIndex].mediaList.push({
        type,
        localData: filePath,
        coverUrl: thumbTempFilePath
      });
    } else {
      data[active].questions[questionIndex].mediaList = [
        {
          type,
          localData: filePath,
          coverUrl: thumbTempFilePath
        }
      ];
    }
    upload2Server(filePath, type, v => {
      console.log("🚀 ~ file: brain.tsx ~ line 128 ~ success ~ v", v);
      data[active].questions[questionIndex].attachments.push({
        type,
        serverId: v.id
      });
    });
    setData([...data]);
  };

  const chooseMedia = (type: MediaType) => {
    const isVideo = type === MediaType.VIDEO;
    wx.chooseMedia({
      count: 1,
      mediaType: [isVideo ? "video" : "image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        console.log(1, res);
        mediaList({
          type,
          filePath,
          thumbTempFilePath: res.tempFiles[0].thumbTempFilePath
        });
      }
    });
  };

  const startRecord = () => {
    setIsRecord(true);
    if (!recorderManager.current) {
      recorderManager.current = getRecorderManager();
      recorderManager.current.onStop(res => {
        console.log("recorder stop", res);
        const { tempFilePath } = res;
        mediaList({
          type: MediaType.AUDIO,
          filePath: tempFilePath,
          thumbTempFilePath: null
        });
      });
      recorderManager.current.start({
        format: "mp3"
      });
    } else {
      recorderManager.current.start({
        format: "mp3"
      });
    }
  };

  const stopRecord = () => {
    setIsRecord(false);
    recorderManager.current?.stop();
  };

  const startVoice = localId => {
    setIsPlay(true);
    if (!innerAudioContext.current) {
      innerAudioContext.current = createInnerAudioContext();
      innerAudioContext.current.src = localId;
      innerAudioContext.current.play();
    } else {
      innerAudioContext.current.src = localId;
      innerAudioContext.current.play();
    }
  };

  const stopVoice = () => {
    innerAudioContext.current?.stop();
    setIsPlay(false);
  };

  const submit = async () => {
    if (
      data[active].questions[questionIndex]?.mediaList?.length === 0 &&
      data[active].questions[questionIndex]?.answerSn !== 1
    ) {
      Notify.open({ color: "warning", message: "请至少上传一个视频或图片" });
      return;
    }
    const answers: any = [];
    data.forEach(c => {
      c.questions.forEach(v => {
        answers.push({
          answerSn: [v.answerSn] ?? [1],
          questionSn: v.sn,
          remark: v.remark,
          attachments: v.attachments
        });
      });
    });
    let params: any = {
      childrenId: router.params.childId,
      scaleTableCode: router.params.code ?? 9,
      answers
      // answers: data[active].questions?.map((v) => ({
      //   answerSn: v.answerSn ?? 1,
      //   questionSn: v.sn,
      //   remark: v.remark,
      //   attachments: v.attachments,
      // })),
    };
    if (
      Number(router.params.code) === ScaleTableCode.GMS ||
      Number(router.params.code) === ScaleTableCode.BRAIN_GMS
    ) {
      params.orderId = router.params.orderId;
    }
    if (btnText === "上传中") return;
    setBtnText("上传中");
    const res = await request({
      url: "/scaleRecord/save",
      data: params,
      method: "POST"
    });
    if (res.success) {
      setBtnText("提交答案");
      if (Number(router.params.code) === ScaleTableCode.GMS) {
        navigateTo({
          url: `/pages/evaluate/gmsDetail?id=${res.data.id}&returnUrl=/pages/index/index`
        });
      } else if (Number(router.params.code) === ScaleTableCode.BRAIN) {
        navigateTo({
          url: `/pages/evaluate/brainDetail?id=${res.data.id}&returnUrl=/pages/index/index`
        });
      } else {
        navigateTo({
          url: `/pages/evaluate/brainGmsDetail?id=${res.data.id}&returnUrl=/pages/index/index`
        });
      }
      wx.requestSubscribeMessage({
        tmplIds: ["0uUpTebwJQRY49Lcq6IysK3apBtJvKZphwCaccuLCX8"],
        success(res) {}
      });
      // if (router.params.code === "9") {
      // }
    }
  };

  const playVideo = (v, id) => {
    const videoContext = createVideoContext(id);
    videoContext.requestFullScreen({ direction: 0 });
  };

  const del = (i, e) => {
    e.stopPropagation();
    data[active].questions[questionIndex].mediaList.splice(i, 1);
    data[active].questions[questionIndex].attachments.splice(i, 1);
    setData([...data]);
  };

  const preview = (list, e) => {
    const urls = list.filter(v => !v.includes("mp4"));
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e
    });
  };

  return (
    <View>
      <NavBar title={title} />
      <View className={styles.box}>
        {data[active] && (
          <View>
            <View className={styles.tabBox}>
              <View className={styles.subject}>{data[active]?.subject}</View>

              {data[active]?.questions[questionIndex]?.carousels?.length >
                0 && (
                <Swiper
                  autoplay={false}
                  indicatorDots={true}
                  indicatorColor="rgba(0, 0, 0, .3)"
                  indicatorActiveColor="#ffd340"
                >
                  {data[active].questions[questionIndex].carousels.map(m => (
                    <SwiperItem key={m} className={styles.swiperBox}>
                      {m.includes("mp4") ? (
                        <Video
                          src={m}
                          muted
                          loop
                          autoplay
                          controls={false}
                          x5-playsinline="true"
                          webkit-playsinline="true"
                          style={{ width: "100%", height: 143 }}
                        />
                      ) : (
                        <Image
                          style="height: 143px;background: #fff;"
                          src={m}
                          onClick={() =>
                            preview(
                              data[active].questions[questionIndex].carousels,
                              m
                            )
                          }
                        />
                      )}
                    </SwiperItem>
                  ))}
                </Swiper>
              )}
              <View className={styles.tibox}>
                <View style={{ marginBottom: 8 }}>
                  {questionIndex + 1}/{data[active].sum}
                </View>
                <Form>
                  <View className={styles.title}>
                    {data[active].questions[questionIndex]?.name}
                  </View>
                  <Radio.Group
                    value={data[active].questions[questionIndex]?.answerSn ?? 1}
                    onChange={e =>
                      changeVal(
                        e,
                        data[active].questions[questionIndex],
                        "answerSn"
                      )
                    }
                  >
                    {data[active].questions[questionIndex]?.answers.map(c => (
                      <Radio name={c.sn} key={c.sn}>
                        {c.content}
                      </Radio>
                    ))}
                  </Radio.Group>
                  <View className={styles.title}>补充说明（非必填）</View>
                  <Textarea
                    onChange={e =>
                      changeVal(
                        e.detail.value,
                        data[active].questions[questionIndex],
                        "remark"
                      )
                    }
                    style={{ height: 100 }}
                    value={data[active].questions[questionIndex]?.remark ?? ""}
                    placeholder="填写补充说明"
                  />
                  <View className={styles.mediaBox}>
                    {data[active].questions[questionIndex]?.mediaList?.map(
                      (v, i) =>
                        v.type === MediaType.PICTURE ? (
                          <View className={styles.iconBox}>
                            <Image
                              className={styles.imgs}
                              key={i}
                              src={v.localData}
                            />
                            <Clear
                              className={styles.clear}
                              color="#ffd340"
                              onClick={e => del(i, e)}
                            />
                          </View>
                        ) : v.type === MediaType.VIDEO ? (
                          <View
                            className={cls(styles.iconBox, styles.videoBox)}
                            //   style={{ backgroundImage: `url(${v.coverUrl})` }}
                            key={i}
                            onClick={() => playVideo(v.localData, `video${i}`)}
                          >
                            <Video
                              src={v.localData}
                              id={`video${i}`}
                              loop={false}
                              autoplay={false}
                              controls={true}
                              poster={v.coverUrl}
                              style={{ width: 54, height: 54 }}
                              objectFit="contain"
                            ></Video>
                            <Clear
                              className={styles.clear}
                              onClick={e => del(i, e)}
                              color="#ffd340"
                            />
                            {/* <Image src={luxiang} className={styles.luxiang} /> */}
                          </View>
                        ) : (
                          <View className={styles.iconBox} key={i}>
                            {isPlay ? (
                              <PauseCircleOutlined
                                onClick={() => stopVoice()}
                              />
                            ) : (
                              <View>
                                <PlayCircleOutlined
                                  onClick={() => startVoice(v.localData)}
                                />
                                <Clear
                                  className={styles.clear}
                                  onClick={e => del(i, e)}
                                  color="#ffd340"
                                />
                              </View>
                            )}
                          </View>
                        )
                    )}
                    <View
                      className={styles.iconBox}
                      onClick={() => chooseMedia(MediaType.PICTURE)}
                    >
                      <PhotoOutlined />
                    </View>
                    <View
                      className={styles.iconBox}
                      onClick={() => chooseMedia(MediaType.VIDEO)}
                    >
                      <VideoOutlined />
                    </View>
                    <View
                      className={styles.iconBox}
                      onClick={() => {
                        isRecord ? stopRecord() : startRecord();
                      }}
                    >
                      {isRecord ? (
                        <Image className={styles.iconImg} src={StopSvg}></Image>
                      ) : (
                        <Image
                          className={styles.iconImg}
                          src={AudioSvg}
                        ></Image>
                      )}
                    </View>
                  </View>
                </Form>
              </View>
            </View>
            <View className={styles.btnbox}>
              {active === data.length - 1 &&
              questionIndex === data[active]?.questions?.length - 1 ? (
                <View>
                  <Button
                    className={styles.btn}
                    onClick={submit}
                    color="primary"
                  >
                    {btnText === "上传中" ? (
                      <Loading type="spinner" className={styles.customColor} />
                    ) : (
                      btnText
                    )}
                  </Button>
                  {data[active]?.questions?.length > 1 && (
                    <Button className={styles.btn} onClick={pre}>
                      上一题
                    </Button>
                  )}
                </View>
              ) : (
                <View>
                  <Button className={styles.btn} color="primary" onClick={next}>
                    下一题
                  </Button>
                  {(active !== 0 || questionIndex !== 0) && (
                    <Button className={styles.btn} onClick={pre}>
                      上一题
                    </Button>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
       
        <Notify id="notify" />
      </View>
    </View>
  );
}
