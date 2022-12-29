import request from "@/service/request";
import baocun from "@/static/icons/baocun.svg";
import fenxiang from "@/static/icons/fenxiang.svg";
import { Popup } from "@taroify/core";
import { Button, Image, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { CSSProperties, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

export default function Steper({
  report,
  extendStyle
}: {
  report: string | number;
  extendStyle?: CSSProperties;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [reportImg, setReportImg] = useState("");
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
      data: { id: router.params.id, report }
    });
    setReportImg(res.data?.replace(/[\r\n]/g, ""));
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
    const data = reportImg.slice(22);
    fileSystem.writeFile({
      filePath: wx.env.USER_DATA_PATH + `/${time}.png`,
      data,
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
    <View style={extendStyle}>
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
            <Button openType="share" className="shareBtn">
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
          <Image src={reportImg} mode="widthFix" className={styles.reportImg} />
        </View>
      </Popup>
    </View>
  );
}
