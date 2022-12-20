import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import baocun from "@/static/icons/baocun.svg";
import Female from "@/static/icons/female.png";
import fenxiang from "@/static/icons/fenxiang.svg";
import Male from "@/static/icons/male.png";
import Voice from "@/static/icons/voice.svg";
import Doctor from "@/static/imgs/doctor.png";
import NoCaries from "@/static/imgs/report-no_caries.png";
import NoTeeth from "@/static/imgs/report-no_teeth.png";
import { Button, Popup } from "@taroify/core";
import { Canvas, Image, Text, View } from "@tarojs/components";
import Taro, { navigateBack, useRouter } from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./report.module.scss";

const resultColor = {
  1: "#0051EF",
  2: "#FF6B00",
  3: "#FF0000"
};

const resultTypes = {
  no_teeth: {
    symptom: "未发现牙齿",
    color: "#1DA1F2",
    treatment: "您上传的照片未检测到，请重新上传/拍摄照片！"
  },
  no_caries: {
    symptom: "未发现龋齿情况",
    color: "#1DA1F2",
    treatment:
      "您上传的口内照中，暂未发现龋齿，请继续保持口腔卫生，认真刷牙哦！同时定期进行口腔检查和预防性涂氟。"
  },
  caries: {
    symptom: "牙齿存在轻度龋齿",
    color: "#FF6B00",
    treatment:
      "您上传的口内照中，检测到有可能存在龋齿，请及时前往口腔科就医检查！"
  },
  heavy_caries: {
    symptom: "牙齿发现重度龋齿",
    color: "#FF0000",
    treatment: "您上传的口内照中，发现严重龋齿，请尽快前往口腔科就医检查！"
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
  const [show, setShow] = useState(false);
  const [reportImg, setReportImg] = useState("");

  const onNavBarClick = () => {
    const currentPages = Taro.getCurrentPages();
    if (
      currentPages.length > 1 &&
      currentPages[currentPages.length - 2].route.includes(
        "packages/caries/photo"
      )
    ) {
      Taro.navigateBack({
        delta: 2
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
    if (data.id) {
      getCondition();
    }
  }, [data]);

  const getCondition = () => {
    if (data.result.includes("重度龋齿")) {
      setCondition({
        type: "heavy_caries",
        ...resultTypes.heavy_caries
      });
      return;
    }

    if (data.result.includes("轻度龋齿")) {
      setCondition({
        type: "caries",
        ...resultTypes.caries
      });
      return;
    }

    if (data.result.includes("未发现龋齿")) {
      setCondition({
        type: "no_caries",
        ...resultTypes.no_caries
      });
      return;
    }

    setCondition({
      type: "no_teeth",
      ...resultTypes.no_teeth
    });
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
          if (c.score > 0.8) {
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

  const save = async () => {
    // Taro.request({
    //   url:
    //     "http://47.99.84.246:5000/gen-img?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlTmFtZSI6Im95QU1LNU5EZVRnSzN1OXpLYVpweDhaTjc3aE0iLCJ1c2VySWQiOiIxMzIiLCJwbGF0Zm9ybUNvZGUiOjJ9.rNYwBR-PkQ2oXDpGXPGe1sAQyjNKAi4RsWgs-DZIZPPK7p_38nSCuArmFA-Q8eJKzGKaXuYySBgPPoDBwkFugA&id=331",
    //   success(res) {
    //     console.log("🚀 ~ file: report.tsx:193 ~ success ~ res", res);
    //   }
    // });
    setShow(true);

    const res = await request({
      url: "/check/report",
      data: { id: router.params.id }
    });
    setReportImg(res.data?.replace(/[\r\n]/g, ""));
    // console.log("🚀 ~ file: report.tsx:193 ~ save ~ res", res);
  };

  const saveImg = () => {
    if (!reportImg) {
      wx.showToast({
        title: "图片生成中",
        icon: "loading"
      });
      return;
    }
    const fileSystem = wx.getFileSystemManager();
    const time = new Date().valueOf();
    fileSystem.writeFile({
      filePath: wx.env.USER_DATA_PATH + `/${time}.png`,
      data: reportImg,
      encoding: "base64",
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + `/${time}.png`,
          success: function(res) {
            wx.showToast({
              title: "保存成功"
            });
          },
          fail: function(err) {
            console.log(err);
          }
        });
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    });
  };

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
          <View className={styles.content} ref={canvasBox}>
            <View className={styles.result}>
              <Image className={styles.doctor} mode="widthFix" src={Doctor} />
              <View className={styles.title}>
                <Text className={styles.label}>检测结果：</Text>
                <Text style={{ color: condition.color }}>
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
              condition.type === "heavy_caries") &&
              teethList?.map((v, i) => (
                <View className={styles.teeth} key={i}>
                  <View className={styles.title}>
                    提示：检测出的龋齿已被标出
                  </View>
                  <View className={styles.teethImgBox}>
                    <Canvas
                      type="2d"
                      id={`canvas${i}`}
                      style={{ width: v.canvasW, height: v.canvasH }}
                    />
                  </View>
                </View>
              ))}
          </View>
        )}
        <View className={cls(styles.btn)} onClick={save}>
          保存/分享
        </View>
        <Popup
          defaultOpen
          placement="bottom"
          open={show}
          onClose={() => setShow(false)}
        >
          <View className={styles.shareBox}>
            <View className={styles.shareIconBox}>
              <Button openType="share" className={styles.shareBtn}>
                <View>
                  <View className={styles.iconBox}>
                    <Image src={fenxiang} className={styles.icon} />
                  </View>
                  <View className={styles.iconText}>分享</View>
                </View>
              </Button>

              <View onClick={saveImg}>
                <View className={styles.iconBox}>
                  <Image src={baocun} className={styles.icon} />
                </View>
                <View className={styles.iconText}>保存</View>
              </View>
            </View>
            <View className={styles.cancel} onClick={() => setShow(false)}>
              取消
            </View>
          </View>
          <View className={styles.genImgBox}>
            <Image
              src={reportImg}
              mode="widthFix"
              className={styles.reportImg}
            />
          </View>
        </Popup>
      </View>
    </View>
  );
}
