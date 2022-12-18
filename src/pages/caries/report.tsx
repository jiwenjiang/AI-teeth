import NavBar from "@/comps/NavBar";
import { SystemContext } from "@/service/context";
import request from "@/service/request";
import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Tishi from "@/static/imgs/weixintishi.png";
import Doctor from "@/static/imgs/doctor.png";
import NoTeeth from "@/static/imgs/report-no_teeth.png";
import NoCaries from "@/static/imgs/report-no_caries.png";
import { Canvas, Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { navigateBack, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./report.module.scss";

const resultColor = {
  1: "#0051EF",
  2: "#FF6B00",
  3: "#FF0000"
};

const resultTypes = {
  'no_teeth': {
    symptom: '未发现牙齿',
    color: '#1DA1F2',
    treatment: '您上传的照片未检测到，请重新上传/拍摄照片！',
  },
  'no_caries': {
    symptom: '未发现龋齿情况',
    color: '#1DA1F2',
    treatment: '您上传的口内照中，暂未发现龋齿，请继续保持口腔卫生，认真刷牙哦！同时定期进行口腔检查和预防性涂氟。',
  },
  'caries': {
    symptom: '牙齿存在轻度龋齿',
    color: '#FF6B00',
    treatment: '您上传的口内照中，检测到有可能存在龋齿，请及时前往口腔科就医检查！',
  },
  'heavy_caries': {
    symptom: '牙齿存在重度龋齿',
    color: '#FF0000',
    treatment: '您上传的口内照中，发现严重龋齿，请尽快前往口腔科就医检查！',
  },
};

const canvasWidth = 300;

export default function App() {
  const router = useRouter();
  const { systemInfo } = useContext(SystemContext);
  const [navBarTitle] = useState(router.params.childName ?? "儿童龋齿检测");
  const [data, setData] = useState<any>({});
  const [condition, setCondition] = useState<any>(null);
  const canvasBox = useRef();
  const [teethList, setTeethList] = useState<any>([]);

  const onNavBarClick = () => {
    const currentPages = Taro.getCurrentPages();
    if (currentPages.length > 1 && currentPages[currentPages.length - 2].route.includes('pages/caries/photo')) {
      Taro.navigateBack({
        delta: 2,
      });
    } else {
      navigateBack();
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
    getCondition();
  }, [data]);

  const getCondition = () => {
    switch (data.result) {
      case resultTypes.heavy_caries.symptom:
        setCondition({
          type: 'heavy_caries',
          ...resultTypes.heavy_caries,
        });
        break;
      case resultTypes.caries.symptom:
        setCondition({
          type: 'caries',
          ...resultTypes.caries,
        });
        break;
      case resultTypes.no_caries.symptom:
        setCondition({
          type: 'no_caries',
          ...resultTypes.no_caries,
        });
        break;
      case resultTypes.no_teeth.symptom:
      default:
        setCondition({
          type: 'no_teeth',
          ...resultTypes.no_teeth,
        });
        break;
    }
  }

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
          if (c.score > 0.8) {
            ctx.lineWidth = 2;
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
    if (condition?.type === 'caries' || condition?.type === 'heavy_caries') {
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
              <Text className={styles.age}>{data?.children?.age}岁</Text>
            </View>
            <Text className={styles.time}>{data?.children?.birthday}</Text>
          </View>
        </View>
        {condition && (
          <View
            className={styles.content}
            ref={canvasBox}
          >
            <View className={styles.result}>
              <Image className={styles.doctor} mode='widthFix' src={Doctor} />
              <View className={styles.title}>
                <Text className={styles.label}>检测结果：</Text>
                <Text
                  style={{ color: condition.color }}
                >
                  {condition.symptom}
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
            {condition.type === 'no_teeth' && (
              <View className={styles.no_teeth}>
                <Image className={styles.img} mode='widthFix' src={NoTeeth} />
              </View>
            )}
            {condition.type === 'no_caries' && (
              <View className={styles.no_caries}>
                <Image className={styles.img} mode='widthFix' src={NoCaries} />
              </View>
            )}
            {(condition.type === 'caries' || condition.type === 'heavy_caries') && teethList?.map((v, i) => (
              <View className={styles.teeth} key={i}>
                <View className={styles.title}>{v.positionName}</View>
                <View className={styles.teethImgBox}>
                  <Canvas
                    type="2d"
                    id={`canvas${i}`}
                    style={{ width: v.canvasW, height: v.canvasH }}
                  />
                  {/* <Image src={v.imageUrl}></Image> */}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
