import Taro, {
  getCurrentPages,
  navigateTo,
  setStorageSync,
  useRouter
} from "@tarojs/taro";
import { useRef, useState } from "react";
import request from "./request";

export function useReportBtnHandle() {
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  let payRes = useRef<any>();

  const checkPay = async (c, isSelf = false) => {
    if (c.resourceId || c.productId) {
      const checkRes = await request({
        url: "/order/video/check",
        data: {
          resourceId: c.resourceId
        }
      });
      if (checkRes.data.hasPaidOrder) {
        if (isSelf) {
          navigateTo({
            url: `${c.content}?recordId=${router.params.id}`
          });
        } else {
          Taro.navigateToMiniProgram({
            appId: checkRes.data.appId,
            path: checkRes.data.page,
            success(res) {
              // 打开成功
            }
          });
        }
      } else {
        if (checkRes.data.orderId) {
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: checkRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
          setOpen(true);
        } else {
          const orderRes = await request({
            url: "/order/video/create",
            data: {
              resourceId: c.resourceId,
              productId: c.productId
            }
          });
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: orderRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
          setOpen(true);
        }
      }
    } else {
      Taro.navigateToMiniProgram({
        appId: c.appId,
        path: c.content,
        success(res) {
          // 打开成功
        }
      });
    }
  };

  const toPay = () => {
    setOpen(false);
    wx.requestPayment({
      timeStamp: payRes.current.data.timeStamp,
      nonceStr: payRes.current.data.nonceStr,
      package: payRes.current.data.packageValue,
      signType: payRes.current.data.signType,
      paySign: payRes.current.data.paySign,
      success(res) {
        checkPay(payRes.current.order, payRes.current.order?.type === "SELF");
      }
    });
  };
  return { checkPay, toPay, open, setOpen, price };
}

export function useAuth() {
  const getAuth = async (cb?: Function) => {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();
    const res = await request({
      url: "/miniapp/wxLogin",
      data: {
        code: login.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      }
    });
    if (res.code === 0) {
      setStorageSync("token", res.data.token);
      setStorageSync("user", res.data.user);
      cb?.();
    }

    if (res.code === 2) {
      const pages = getCurrentPages();
      const path = pages[pages.length - 1].route;
      navigateTo({ url: `/pages/login/index?returnUrl=/${path}` });
    }
  };
  return { getAuth };
}
