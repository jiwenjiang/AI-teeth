import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import Taro, {
  getCurrentPages,
  navigateBack,
  useRouter,
  switchTab,
} from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Canvas,
} from "@tarojs/components";

import NavBar from "@/comps/NavBar";
import Share from "@/comps/Share";

import request from "@/service/request";

import dayjs from "dayjs";

import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Doctor from "@/static/imgs/doctor.png";
import NoCaries from "@/static/imgs/report-no_caries.png";
import NoTeeth from "@/static/imgs/report-no_teeth.png";

import styles from "./report.module.scss";

const resultColor = {
  2: "#FF9900",
  3: "#FF0000"
};

const resultTypes = {
  "-2": {
    type: 'detecting',
    color: "#1DA1F2",
  },
  "-1": {
    type: 'no_teeth',
    color: "#1DA1F2",
    treatment: '您上传的照片未检测到牙齿，请重新上传/拍摄照片！',
  },
  "1": {
    type: 'no_caries',
    color: "#1DA1F2",
    treatment: '您上传的口内照中，暂未发现龋齿，请继续保持口腔卫生，认真刷牙哦！同时定期进行口腔检查和预防性涂氟。',
  },
  "2": {
    type: 'caries',
    color: "#FF6B00",
    treatment: '您上传的口内照中，检测到有可能存在龋齿，请及时前往口腔科就医检查！',
  },
  "3": {
    type: 'heavy_caries',
    color: "#FF0000",
    treatment: '您上传的口内照中，检测到有可能存在龋齿，请及时前往口腔科就医检查！',
  }
};

const canvasWidth = 300;

export default function App() {
  const router = useRouter();
  const [navBarTitle] = useState(router.params.childName ?? "儿童龋齿检测");
  const [data, setData] = useState<any>({});
  const [condition, setCondition] = useState<any>(null);
  const canvasBox = useRef();
  const [teethList, setTeethList] = useState<any>([]);

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

  const getReport = async () => {
    const response = await request({
      url: "/check/get",
      data: { id: router.params.id || 74 }
    });
    setData(response.data);
  };

  useEffect(() => {
    getReport();
  }, []);

  useEffect(() => {
    if (data.id) {
      getCondition();
    }
  }, [data]);

  const getCondition = () => {
    if (Object.keys(resultTypes).includes(data.resultLevel.toString())) {
      setCondition(resultTypes[data.resultLevel.toString()])
    }
  };

  const renderCanvas = async (v, i) => {
    Taro.createSelectorQuery()
      .select(`#canvas${i}`)
      .node(async res => {
        const canvasNode = res.node;

        const ctx = canvasNode.getContext("2d");
        const image = canvasNode.createImage();
        // 等待图片加载
        await new Promise(resolve => {
          image.onload = resolve;
          image.src = v.imageUrl; // 要加载的图片 url
        });

        canvasNode.width = image.width;
        canvasNode.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height);
        v.imageResults.forEach(c => {
          if (c.result > 1 && c.score >= 0.8) {
            ctx.lineWidth = 8;
            ctx.strokeStyle = resultColor[c.result];
            ctx.strokeRect(
              c.bbox[0],
              c.bbox[1],
              c.bbox[2] - c.bbox[0],
              c.bbox[3] - c.bbox[1]
            );
          }
        });
        ctx.scale(1.5, 1.5);
      })
      .exec();
  };

  const calcCanvasSize = async arr => {
    const canvas = wx.createOffscreenCanvas({
      type: "2d",
      width: 300,
      height: 150
    });

    for (let v of arr) {
      const image = canvas.createImage();
      // 等待图片加载
      await new Promise(resolve => {
        image.onload = resolve;
        image.src = v.imageUrl; // 要加载的图片 url
      });
      v.canvasW = canvasWidth;
      v.scale = canvasWidth / image.width;
      v.canvasH = image.height * v.scale;
    }
    setTeethList([...arr]);
    Taro.nextTick(() => {
      arr.forEach((v, i) => {
        renderCanvas(v, i);
      });
    });
  };

  useEffect(() => {
    if (condition?.type === "caries" || condition?.type === "heavy_caries") {
      calcCanvasSize(data.images);
    }
  }, [data, condition]);

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
        {condition && (
          <View className={styles.content} ref={canvasBox}>
            <View className={styles.result}>
              <Image className={styles.doctor} mode="widthFix" src={Doctor} />
              <View className={styles.title}>
                <Text className={styles.label}>检测结果：</Text>
                <Text style={{ color: condition.color }}>
                  {data.result}
                </Text>
              </View>
              <View className={styles.card}>
                <View className={styles.head}>治疗方案</View>
                <View className={styles.resultBody}>
                  <View>{condition.treatment}</View>
                  <View className={styles.desc}>
                    <Image className={styles.icon} src={Voice} />
                    （测量结果仅供参考，具体结果请以口腔医生检查结果为准。）
                  </View>
                </View>
              </View>
            </View>
            {condition.type === "no_teeth" && (
              <View className={styles.no_teeth}>
                <Image className={styles.img} mode="widthFix" src={NoTeeth} />
              </View>
            )}
            {condition.type === "no_caries" && (
              <View className={styles.no_caries}>
                <Image className={styles.img} mode="widthFix" src={NoCaries} />
              </View>
            )}
            {(condition.type === "caries" ||
              condition.type === "heavy_caries") && (
                <View className={styles.teeth}>
                  <View className={styles.title}>提示：检测出的龋齿已被标出</View>
                  {teethList?.map((v, i) => (
                    <View className={styles.teethImgBox} key={i}>
                      <Canvas
                        type="2d"
                        id={`canvas${i}`}
                        style={{ width: v.canvasW, height: v.canvasH }}
                      />
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}
        <Share report={1} />
      </View>
    </View>
  );
}
