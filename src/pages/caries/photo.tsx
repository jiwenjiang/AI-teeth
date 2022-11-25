import MaskLoading from "@/comps/Loading";
import NavBar from "@/comps/NavBar";
import { DetectType, MediaType } from "@/service/const";
import { SystemContext } from "@/service/context";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import AddPatient from "@/static/icons/add-patient.png";
import Voice from "@/static/icons/voice.svg";
import { Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro, { navigateBack, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./photo.module.scss";

type Card = {
  name: string;
  picture: string;
  position: string;
  precautions: string[];
  remark: string;
  fileUrl?: string;
  fileId?: any;
  samplePicture: string;
};

const mainServices = [
  {
    cnName: "儿童龋齿检测",
    type: DetectType.CARIES
  },
  {
    cnName: "早期矫正预警",
    type: DetectType.WARNING
  }
];

const uploadImg = (v = true) => ({
  text: "照片上传中...",
  show: v
});

const submitImg = {
  text: "照片检测中...",
  show: true
};

export default function App() {
  const router = useRouter();
  const { systemInfo } = useContext(SystemContext);
  const [navBarTitle] = useState(router.params.childName ?? "儿童龋齿检测");
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [attrs, setAttrs] = useState<Card[]>([]);
  const [picIndex, setPicIndex] = useState(0);
  const [fileLoading, setFileLoading] = useState(uploadImg(false));

  const hasPic = attrs?.some(v => v.fileId);
  const guide = attrs[picIndex] ?? {};

  const onNavBarClick = () => {
    if (showGuide) {
      setShowGuide(false);
      return;
    }
    navigateBack();
  };

  const getAttr = async () => {
    const response = await request({
      url: "/check/attribute",
      data: { checkType: router.params.type }
    });
    setAttrs(response.data.positions);
  };

  const choosePhoto = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      camera: "back",
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        setOpen(false);
        const wxInfo = wx.getSystemInfoSync();
        if (wxInfo.platform === "devtools") {
          setFileLoading(uploadImg());
          mediaList({
            type: MediaType.PICTURE,
            filePath: tempFilePath,
            thumbTempFilePath: tempFilePath
          });
        } else {
          wx.editImage({
            src: tempFilePath, // 图片路径
            success(res) {
              setFileLoading(uploadImg());
              mediaList({
                type: MediaType.PICTURE,
                filePath: res.tempFilePath,
                thumbTempFilePath: res.tempFilePath
              });
            },
            fail(e) {
              console.log("err", e);
            }
          });
        }
      }
    });
  };

  const takePhoto = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["camera"],
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        setShowGuide(false);
        wx.editImage({
          src: filePath, // 图片路径
          success(res) {
            setFileLoading(uploadImg());
            mediaList({
              type: MediaType.PICTURE,
              filePath: res.tempFilePath,
              thumbTempFilePath: res.tempFilePath
            });
          },
          fail(e) {
            console.log("err", e);
          }
        });
      }
    });
  };
  const mediaList = ({ type, filePath, thumbTempFilePath }) => {
    upload2Server(filePath, type, v => {
      attrs[picIndex].fileId = v.id;
      attrs[picIndex].fileUrl = v.url;
      setAttrs([...attrs]);
      setFileLoading(uploadImg(false));
    });
    attrs[picIndex].fileUrl = thumbTempFilePath;
    setAttrs([...attrs]);
  };

  const openGuide = () => {
    setShowGuide(true);
    setOpen(false);
  };

  useEffect(() => {
    getAttr();
  }, []);

  const choose = i => {
    setPicIndex(i);
    setOpen(true);
  };

  const submit = async () => {
    if (hasPic) {
      setFileLoading(submitImg);
      const res = await request({
        method: "POST",
        url: "/check/submit",
        data: {
          checkType: Number(router.params.type),
          childrenId: Number(router.params.childrenId),
          images: attrs
            ?.filter(v => v.fileId)
            ?.map(v => ({ fileId: v.fileId, position: v.position }))
        }
      });
      setFileLoading({ ...submitImg, show: false });
      if (Number(router.params.type) === DetectType.CARIES) {
        Taro.navigateTo({
          url: `/pages/caries/report?id=${res.data.id}&childName=${router.params.childName}`
        });
      }
      if (Number(router.params.type) === DetectType.WARNING) {
        Taro.navigateTo({
          url: `/pages/caries/warningReport?id=${res.data.id}&childName=${router.params.childName}`
        });
      }
    }
  };

  return (
    <View className="page" style={{ backgroundColor: "#fff" }}>
      <NavBar title={navBarTitle} back={onNavBarClick} />
      {showGuide ? (
        <View className={styles.guideBox}>
          <View
            className={styles.guide}
            style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 90px)` }}
          >
            <View className={styles.content}>
              <Image className={styles.guideImg} src={guide.picture}></Image>
              <View className={styles.remark}>{guide.remark}</View>
              <View className={styles.desc}>
                （需要获取照相机、相片权限才能开始分析龋齿情况）
              </View>
              <View className={styles.warning}>注意事项</View>
              {guide.precautions?.map((v, i) => (
                <View key={i} className={styles.line}>
                  <View className={styles.icon}>{i + 1}</View>
                  <View className={styles.label}>{v}</View>
                </View>
              ))}
              <View className={styles.warning}>正确示例</View>
              <View className={styles.sampleImg}>
                <Image src={guide.samplePicture} className={styles.samplePic} />
              </View>
            </View>
          </View>
          <View className={styles.btnbox}>
            <View className={styles.btn} onClick={takePhoto}>
              开始拍摄
            </View>
          </View>
        </View>
      ) : (
        <View
          className={styles.body}
          style={{ height: `calc(100vh - ${systemInfo.navHeight}px - 106px)` }}
        >
          <View className={styles.tip}>
            <View className={styles.name}>
              {
                mainServices?.find(
                  v => v.type === +(router.params.type as keyof DetectType)
                )?.cnName
              }
            </View>
            <View className={cls(styles.desc, styles.mt20)}>
              <Image className={styles.icon} src={Voice} />
              <Text className={styles.range}>
                检测范围：4~12岁，年龄范围超出检测结果可能不准确。
              </Text>
            </View>
          </View>
          <View className={styles.content}>
            <View className={cls(styles.desc, styles.pl40)}>
              <Text>拍摄/上传照片越多生成报告越准确哦！</Text>
            </View>
            <View className={styles.cardBox}>
              {attrs?.map((v, i) => (
                <View key={i}>
                  <View className={styles.card}>
                    <View
                      className={styles.cardContent}
                      onClick={() => choose(i)}
                    >
                      {v.fileUrl ? (
                        <View
                          className={styles.cardImg}
                          style={{ backgroundImage: `url(${v.fileUrl})` }}
                        ></View>
                      ) : (
                        // <Image  src={v.fileUrl} />
                        <Image className={styles.addbtn} src={AddPatient} />
                      )}
                    </View>
                  </View>
                  <View className={styles.label}>{v.name}</View>
                </View>
              ))}
            </View>
            <View
              className={cls(styles.btn, hasPic && styles.activeBtn)}
              onClick={submit}
            >
              开始检测
            </View>
          </View>
          <Popup
            defaultOpen
            placement="bottom"
            open={open}
            onClose={() => setOpen(false)}
          >
            <View className={styles.list} onClick={choosePhoto}>
              从相册中选择
            </View>
            <View className={styles.list} onClick={openGuide}>
              拍照
            </View>
            <View className={styles.list} onClick={() => setOpen(false)}>
              取消
            </View>
          </Popup>
        </View>
      )}
      <MaskLoading visible={fileLoading.show} text={fileLoading.text} />
    </View>
  );
}
