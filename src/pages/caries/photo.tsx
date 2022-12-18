import MaskLoading from "@/comps/Loading";
import NavBar from "@/comps/NavBar";
import { DetectType, MediaType } from "@/service/const";
import { SystemContext } from "@/service/context";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import AddPatient from "@/static/icons/add-patient.png";
import RemovePhoto from "@/static/icons/remove.png";
import Warn2 from "@/static/icons/warn2.png";
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

type ImageInfo = {
  fileId?: number;
  fileUrl?: string;
  filePath: string;
}

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
  const [showGuide, setShowGuide] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [attrs, setAttrs] = useState<Card[]>([]);
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [removeIndex, setRemoveIndex] = useState<number>(0);
  const [picIndex, setPicIndex] = useState(0);
  const [fileLoading, setFileLoading] = useState(uploadImg(false));
  const [hasPic, setHasPic] = useState<boolean>(false);
  const guide = attrs[picIndex] ?? {};

  useEffect(() => {
    getAttr();
    initImgInfos();
  }, []);

  useEffect(() => {
    if (Number(router.params.type) === DetectType.CARIES) {
      setHasPic(imageInfos.length > 0);
    } else if (Number(router.params.type) === DetectType.WARNING) {
      setHasPic(attrs?.some(v => v.fileId));
    }
  }, [attrs, imageInfos]);

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

  const initImgInfos = () => {
    if (Number(router.params.type) === DetectType.WARNING) {
      setImageInfos(Array(attrs.length).fill({
        fileId: 0,
        fileUrl: '',
        filePath: '',
      }));
    }
  }

  // 从相册选择图片
  const choosePhoto = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      camera: "back",
      success(res) {
        onPhotoChosen(res);
      }
    });
  };

  // 拍照
  const takePhoto = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["camera"],
      camera: "back",
      success(res) {
        onPhotoChosen(res);
      }
    });
  };

  // 图片准备完毕后的回调
  const onPhotoChosen = (res, mode = 'choose') => {
    const tempFilePath = res.tempFiles[0].tempFilePath;
    const wxInfo = wx.getSystemInfoSync();

    setShowAdd(false);
    showGuide && setShowGuide(false);

    if (mode === 'choose' && wxInfo.platform === "devtools") {
      onPhotoReady({ tempFilePath });
      return;
    }

    wx.editImage({
      src: tempFilePath,
      success(res) {
        onPhotoReady(res);
      },
      fail(e) {
        console.log("err", e);
      }
    });
  }

  // 图片编辑完毕，开始上传
  const onPhotoReady = (res) => {
    setFileLoading(uploadImg());
    uploadImages({
      type: MediaType.PICTURE,
      filePath: res.tempFilePath,
    });
  }

  // 上传图片
  const uploadImages = ({ type, filePath }) => {
    upload2Server(filePath, type, onPhotoUploaded);
  };

  // 保存上传成功后返回的图片信息
  const onPhotoUploaded = (v) => {
    if (Number(router.params.type) === DetectType.CARIES) {
      setImageInfos([
        ...imageInfos,
        {
          fileId: v.id,
          fileUrl: v.url,
          filePath: v.url,
        },
      ]);
    } else if (Number(router.params.type) === DetectType.WARNING) {
      attrs[picIndex].fileId = v.id;
      attrs[picIndex].fileUrl = v.url;
      setAttrs([...attrs]);
    }
    setFileLoading(uploadImg(false));
  }

  const openGuide = () => {
    setShowGuide(true);
    setShowAdd(false);
  };

  const choose = (i) => {
    setPicIndex(i);
    setShowAdd(true);
  };

  const beforeRemovePhoto = (i: number) => {
    setRemoveIndex(i);
    setShowRemove(true);
  }

  const removePhoto = () => {
    setImageInfos(imageInfos.filter((_, index) => index !== removeIndex));
    setShowRemove(false);
  }

  const submit = async () => {
    if (hasPic) {
      setFileLoading(submitImg);
      let images;
      if (Number(router.params.type) === DetectType.CARIES) {
        images = imageInfos
          ?.map((v, i) => ({
            fileId: v.fileId,
            position: (i + 1).toString(),
          }))
      } else if (Number(router.params.type) === DetectType.WARNING) {
        images = attrs
          ?.filter(v => v.fileId)
          ?.map(v => ({
            fileId: v.fileId,
            position: v.position,
          }))
      }

      const res = await request({
        method: "POST",
        url: "/check/submit",
        data: {
          checkType: Number(router.params.type),
          childrenId: Number(router.params.childrenId),
          images,
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

  const doUploadCards = () => {
    if ((router.params.type === '1' && imageInfos.length < 10)) {
      return (
        attrs?.map((v, i) => (
          <View key={i}>
            <View className={styles.card}>
              <View
                className={styles.cardContent}
                onClick={() => choose(i)}
              >
                <Image className={styles.addbtn} mode='aspectFit' src={AddPatient} />
              </View>
            </View>
            <View className={styles.label}>{v.name}</View>
          </View>
        ))
      )
    } else if (router.params.type === '2') {
      return (
        attrs?.map((v, i) => (
          <View key={i}>
            <View className={styles.card}>
              <View
                className={styles.cardContent}
                onClick={() => choose(i)}
              >
                {v.fileUrl ? (
                  <Image className={styles.cardImg} mode='aspectFit' src={v.fileUrl} />
                ) : (
                  <Image className={styles.addbtn} src={AddPatient} />
                )}
              </View>
            </View>
            <View className={styles.label}>{v.name}</View>
          </View>
        ))
      )
    } else {
      return null
    }
  }

  const uploadedCards = () => {
    if (router.params.type === '1' && imageInfos.length > 0) {
      return (
        imageInfos.map((v, i) => (
          <View className={styles.cardWrapper} key={i}>
            <View className={styles.card}>
              <View className={styles.cardContent}>
                <Image className={styles.cardImg} mode='aspectFit' src={v.filePath} />
              </View>
            </View>
            <View className={styles.label}>照片{i + 1}</View>
            <Image
              className={styles.removePhoto}
              src={RemovePhoto}
              onClick={() => beforeRemovePhoto(i)}
            />
          </View>
        ))
      )
    } else {
      return null
    }
  }

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
              <Image className={styles.guideImg} mode='aspectFit' src={guide.picture}></Image>
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
                <Image src={guide.samplePicture} mode='widthFix' className={styles.samplePic} />
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
          {/* 页面标题及检测范围提示 */}
          <View className={styles.tip}>
            <View className={styles.name}>
              {
                mainServices?.find(
                  v => v.type === +(router.params.type as keyof DetectType)
                )?.cnName
              }
            </View>
            <View className={styles.desc}>
              <Image className={styles.icon} src={Voice} />
              <Text className={styles.range}>
                检测范围：4~12岁，年龄范围超出检测结果可能不准确。
              </Text>
            </View>
          </View>
          {/* 选择照片并上传 */}
          <View className={styles.content}>
            <View className={styles.desc2}>
              <Image className={styles.icon} mode='aspectFit' src={Warn2} />
              <Text>拍摄/上传照片越多生成报告越准确哦！</Text>
            </View>
            <View className={styles.cardBox}>
              {doUploadCards()}
              {uploadedCards()}
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
            open={showAdd}
            onClose={() => setShowAdd(false)}
          >
            <View className={styles.list} onClick={choosePhoto}>
              从相册中选择
            </View>
            <View className={styles.list} onClick={openGuide}>
              拍照
            </View>
            <View className={styles.list} onClick={() => setShowAdd(false)}>
              取消
            </View>
          </Popup>
          <Popup
            defaultOpen
            placement="bottom"
            open={showRemove}
            onClose={() => setShowRemove(false)}
          >
            <View className={styles.list} onClick={removePhoto}>
              确认删除
            </View>
            <View className={styles.list} onClick={() => setShowRemove(false)}>
              取消
            </View>
          </Popup>
        </View>
      )}
      <MaskLoading visible={fileLoading.show} text={fileLoading.text} />
    </View>
  );
}
