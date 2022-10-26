import { MediaType } from "@/service/const";
import request from "@/service/request";
import { PauseCircleOutlined, PlayCircleOutlined } from "@taroify/icons";
import { Image, Video, View } from "@tarojs/components";
import {
    createInnerAudioContext,
    createVideoContext,
    InnerAudioContext,
    useRouter
} from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./detail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const router = useRouter();
  const [isPlay, setIsPlay] = useState(false);
  const innerAudioContext = useRef<InnerAudioContext>();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleRecord/detail",
        data: { id: router.params.id }
      });
      setData(res.data);
    })();
  }, []);

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

  const playVideo = (v, id) => {
    const videoContext = createVideoContext(id);
    videoContext.requestFullScreen({ direction: 0 });
  };

  return (
    <View>
      {data.questions?.map((v, i) => (
        <View className={styles.cardBox} key={i}>
          <View className={styles.card}>
            <View className={styles.title}>
              {i + 1}/{data?.questions?.length} &nbsp; {v.questionContent}
            </View>
            <View>
              <View className={styles.subTitle}>{v.answerContent}</View>
              <View className={styles.remark}>补充说明：{v.remark}</View>
              <View
                className={styles.mediaBox}
                style={{ borderBottom: "none" }}
              >
                {v.attachments?.map((m, i) => (
                  <View key={i}>
                    {m.type === MediaType.PICTURE ? (
                      <Image className={styles.imgs} key={i} src={m.url} />
                    ) : m.type === MediaType.VIDEO ? (
                      <View
                        className={cls(styles.iconBox, styles.videoBox)}
                        //   style={{ backgroundImage: `url(${v.coverUrl})` }}
                        key={i}
                        onClick={() => playVideo(m.url, `video${i}`)}
                      >
                        <Video
                          src={m.url}
                          id={`video${i}`}
                          loop={false}
                          autoplay={false}
                          controls={true}
                          poster={v.coverUrl}
                          style={{ width: 54, height: 54 }}
                          objectFit="contain"
                        ></Video>
                        {/* <Image src={luxiang} className={styles.luxiang} /> */}
                      </View>
                    ) : (
                      <View className={styles.iconBox} key={i}>
                        {isPlay ? (
                          <PauseCircleOutlined onClick={() => stopVoice()} />
                        ) : (
                          <PlayCircleOutlined
                            onClick={() => startVoice(m.url)}
                          />
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
