import NavBar from "@/comps/NavBar";
import Steper from "@/comps/Steper";
import { MediaType, ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import AudioSvg from "@/static/icons/audio.svg";
import StopSvg from "@/static/icons/stop.svg";
import { Button, Loading, Notify, Popup, Textarea } from "@taroify/core";
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

const stepList = [
  { label: "自发姿势运动", desc: "拍摄视频" },
  { label: "扶持迈步激发运动", desc: "拍摄视频" },
  { label: "补充其他信息", desc: "" }
];

export default function App() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [guides, setGuides] = useState({ pictures: [], videos: [], words: [] });
  const [active, setActive] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [chooseAns, setChooseAns] = useState<any>([]);
  const [isPlay, setIsPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  const [btnText, setBtnText] = useState("提交答案");
  const recorderManager = useRef<RecorderManager>();
  const innerAudioContext = useRef<InnerAudioContext>();
  const [title] = useState(transTitle(Number(router.params.code)));

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: { code: router.params.code ?? 12, birthday: router.params.age ?? 0 }
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

  const getGuide = async () => {
    const res = await request({
      url: "/scaleTable/guide",
      data: {
        code: router.params.code ?? 9,
        questionSn: data[active].questions[questionIndex].sn
      }
    });

    setGuides(res.data);
    setVisible(true);
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
    // if (
    //   data[active].questions[questionIndex]?.mediaList?.length === 0 &&
    //   data[active].questions[questionIndex]?.answerSn !== 1
    // ) {
    //   Notify.open({
    //     color: "warning",
    //     message: "请至少上传一个视频或图片"
    //   });
    //   return;
    // }
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
    data.forEach((c, i) => {
      c.questions.forEach((v, i2) => {
        answers.push({
          answerSn: i2 === 2 ? chooseAns : [v.answerSn],
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

  const addChoose = v => {
    if (chooseAns.includes(v)) {
      setChooseAns(chooseAns.filter(c => c !== v));
    } else {
      setChooseAns([...chooseAns, v]);
    }
  };

  return (
    <View className={styles.box}>
      <NavBar title={title} />
      <View className={styles.stepBox}>
        <Steper
          list={stepList}
          extendStyle={{ paddingBottom: 40 }}
          activeIndex={questionIndex}
        ></Steper>
      </View>
      <View>
        {data[active] && (
          <View>
            <View className={styles.tabBox}>
              {(questionIndex === 0 || questionIndex === 1) && (
                <View className={styles.zhinan}>
                  <View className={styles.zhinanText}>
                    请根据拍摄指南，拍摄孩子自发姿势运动视频
                  </View>
                  <View className={styles.chakanzhinan} onClick={getGuide}>
                    查看拍摄指南
                  </View>
                </View>
              )}

              {questionIndex === 2 && (
                <View className={styles.answers}>
                  <View className={styles.zhinanText}>
                    请您根据孩子的日常运动表现，您的孩子不会下面哪些
                    动作（非必填，可多选，可上传视频）
                  </View>
                  <View className={styles.tagBox}>
                    {data[active].questions[questionIndex].answers?.map(
                      (v, i) => (
                        <View
                          key={i}
                          onClick={() => addChoose(v.sn)}
                          className={cls(
                            styles.tag,
                            chooseAns.includes(v.sn) && styles.activeTag
                          )}
                        >
                          {v.content}
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}

              <View className={styles.tibox}>
                <Form>
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
            <View>
              {active === data.length - 1 &&
              questionIndex === data[active]?.questions?.length - 1 ? (
                <View className={styles.btnbox}>
                  {data[active]?.questions?.length > 1 && (
                    <Button className={styles.btn} onClick={pre}>
                      上一步
                    </Button>
                  )}
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
                </View>
              ) : (
                <View className={styles.btnbox}>
                  {questionIndex !== 0 && (
                    <Button className={styles.btn} onClick={pre}>
                      上一步
                    </Button>
                  )}
                  <Button className={styles.btn} color="primary" onClick={next}>
                    下一步
                  </Button>
                </View>
              )}
            </View>
          </View>
        )}
        <Popup
          placement="bottom"
          style={{ height: "80%" }}
          onClose={() => setVisible(false)}
          open={visible}
        >
          {guides.videos?.length > 0 && (
            <View className={styles.cardBox}>
              <View className={styles.card}>
                <View className={styles.title}>拍摄指导视频 </View>
                <Swiper
                  autoplay={false}
                  indicatorDots={true}
                  indicatorColor="rgba(0, 0, 0, .3)"
                  indicatorActiveColor="#ffd340"
                >
                  {guides.pictures.map(m => (
                    <SwiperItem key={m} className={styles.swiperBox}>
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
                    </SwiperItem>
                  ))}
                </Swiper>
              </View>
            </View>
          )}

          {guides.pictures?.length > 0 && (
            <View className={styles.cardBox}>
              <View className={styles.card}>
                <View className={styles.title}>拍摄指导图片 </View>
                <Swiper
                  autoplay={false}
                  indicatorDots={true}
                  indicatorColor="rgba(0, 0, 0, .3)"
                  indicatorActiveColor="#ffd340"
                >
                  {guides.pictures.map(m => (
                    <SwiperItem key={m} className={styles.swiperBox}>
                      <Image
                        style="height: 143px;background: #fff;"
                        src={m}
                        onClick={() => preview(guides.pictures, m)}
                      />
                    </SwiperItem>
                  ))}
                </Swiper>
              </View>
            </View>
          )}

          {guides.words?.length > 0 && (
            <View className={styles.cardBox}>
              <View className={styles.card}>
                <View className={styles.title}>拍摄说明 </View>
                {guides.words.map((v, i) => (
                  <View key={i} className={styles.intro}>
                    {v}
                  </View>
                ))}
              </View>
            </View>
          )}
        </Popup>
        <Notify id="notify" />
      </View>
    </View>
  );
}
