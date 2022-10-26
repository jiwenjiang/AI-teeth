import { useEffect, useState } from "react";

import { Image, Text, View } from "@tarojs/components";
import { navigateTo, navigateToMiniProgram, useRouter } from "@tarojs/taro";

import request from "@/service/request";

import "./interventionList.scss";

export default function App() {
  const router = useRouter();
  const [videoList, setVideoList] = useState([]);

  const getScaleOrderList = () => {
    useEffect(() => {
      (async () => {
        const res = await getInterventionList();
      })();
    }, []);
  };

  getScaleOrderList();

  const getInterventionList = async () => {
    const res = await request({
      url: `/scaleRecord/abnormal/methods?recordId=${router.params.recordId ??
        122}`
    });

    if (res.data.length) {
      setVideoList(res.data);
    }
  };

  const watchVideo = page => {
    navigateToMiniProgram({
      appId: "wx98dc9b974915de77",
      path: page
    });
  };

  const readIntro = abnormalIterm => {
    navigateTo({
      url: `/pages/evaluate/interventionDetail?abnormalIterm=${encodeURIComponent(
        abnormalIterm
      )}`
    });
  };

  return (
    <View className="intervention-list">
      {videoList?.map((v, index) => (
        <View key={v.recordId} className="video-info">
          <View className="video-title">
            <Text className="title">{v.name}</Text>
          </View>
          <View className="video-cover">
            <Image src={v.coverUrl} className="cover" />
          </View>
          <View className="actions">
            <Text className="watch-video" onClick={() => watchVideo(v.page)}>
              观看视频
            </Text>
            <Text className="read-intro" onClick={() => readIntro(v.abnormalIterm)}>
              详细介绍
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
