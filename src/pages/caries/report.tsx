import NavBar from "@/comps/NavBar";
import { SystemContext } from "@/service/context";
import request from "@/service/request";
import Female from "@/static/icons/female.png";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Tishi from "@/static/imgs/weixintishi.png";
import { Canvas, Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { navigateBack, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./report.module.scss";

const resultColor = {
  1: "#0051EF",
  2: "#FF6B00",
  3: "#FF0000"
};

export default function App() {
  const router = useRouter();
  const { systemInfo } = useContext(SystemContext);
  const [navBarTitle] = useState(router.params.childName ?? "儿童龋齿检测");
  const [data, setData] = useState<any>({});
  const canvasBox = useRef();

  const onNavBarClick = () => {
    navigateBack();
  };

  const getAttr = async () => {
    const response = await request({
      url: "/check/get",
      data: { id: router.params.id || 74 }
    });
    setData(response.data);
  };

  useEffect(() => {
    getAttr();
  }, []);

  const renderCanvas = async (v, i) => {
    // const canvasNode = wx.createOffscreenCanvas({type: '2d', width: 300, height: 150})
    // // const canvasNode = res[0].node;
    // const ctx = canvasNode.getContext("2d");
    // // const dpr = wx.getSystemInfoSync().pixelRatio;
    // // canvasNode.width = 304 * dpr;
    // // canvasNode.height = 150 * dpr;
    // // ctx.scale(dpr, dpr);
    // const image = canvasNode.createImage();
    // // 等待图片加载
    // await new Promise(resolve => {
    //   image.onload = resolve;
    //   image.src = v.imageUrl; // 要加载的图片 url
    // });
    // ctx.drawImage(image, 0, 0, 304, 150);
    // v.imageResults.forEach(c => {
    //   ctx.strokeStyle = resultColor[c.result];
    //   ctx.strokeRect(
    //     c.bbox[0],
    //     c.bbox[1],
    //     c.bbox[2] - c.bbox[0],
    //     c.bbox[3] - c.bbox[1]
    //   );
    // });
    // const imgData = ctx.getImageData(0, 0, 300, 150);
    // console.log("🚀 ~ file: report.tsx ~ line 67 ~ renderCanvas ~ imgData", imgData)

    // ----
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
        ctx.drawImage(image, 0, 0, 304, 150);
        v.imageResults.forEach(c => {
          ctx.strokeStyle = resultColor[c.result];
          ctx.strokeRect(
            c.bbox[0],
            c.bbox[1],
            c.bbox[2] - c.bbox[0],
            c.bbox[3] - c.bbox[1]
          );
        });
      })
      .exec();
    // Taro.createSelectorQuery()
    //   .in(this)
    //   .select(`#canvas${i}`)
    //   .fields({ node: true, size: true })
    //   .exec(async res => {

    //   });
  };

  useEffect(() => {
    if (data.images) {
      Taro.nextTick(() => {
        setTimeout(() => {
          data.images.forEach((v, i) => {
            renderCanvas(v, i);
          });
        }, 400);
      });
    }
  }, [data]);

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
        <ScrollView
          className={styles.content}
          scrollY
          style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 106px)` }}
          ref={canvasBox}
        >
          <View className={styles.result}>
            <View className={styles.title}>
              <Text className={styles.label}>检测结果：</Text>
              <Text className={styles.key}>{data?.result}</Text>
            </View>
            {/* <Image className={styles.doctor} src={Doctor} /> */}
            <View className={styles.card}>
              <View className={styles.head}>治疗方案</View>
              <View className={styles.resultBody}>
                <View>{data?.treatment}</View>
                <View className={styles.desc}>
                  <Image className={styles.icon} src={Voice} />
                  (以上治疗方案为辅助判断，具体方案请以牙科医生检查结果为准）。
                </View>
              </View>
            </View>
          </View>
          <View className={styles.refer}>
            <Image className={styles.tishi} src={Tishi} />
            <Text className={styles.tishitext}>温馨提示</Text>
            <View className={styles.chengdu}>
              <View className={styles.item}>轻度龋齿</View>
              <View className={styles.item}>中度龋齿</View>
              <View className={styles.item}>重度龋齿</View>
            </View>
          </View>
          {data?.images?.map((v, i) => (
            <View className={styles.teeth} key={i}>
              <View className={styles.title}>{v.positionName}</View>
              <View className={styles.teethImgBox}>
                <Canvas
                  type="2d"
                  id={`canvas${i}`}
                  style={{ height: 150, width: 304 }}
                />
                {/* <Image src={v.imageUrl}></Image> */}
              </View>
            </View>
          ))}
        </ScrollView>
        {/* <View className={cls(styles.btn)} onClick={submit}>
          开始检测
        </View> */}
      </View>
    </View>
  );
}
