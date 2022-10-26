import Box from "@/comps/Box";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import Book from "@/static/icons/bookmark-3-fill.svg";
import Cny from "@/static/icons/exchange-cny-fill.svg";
import Psy from "@/static/icons/psychotherapy-fill.svg";
import { Button, Checkbox, Notify, Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import "./gmsPay.scss";

export default function App() {
  const [value, setValue] = useState(false);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const childContext = useContext(ChildContext);

  const router = useRouter();

  const buy = async () => {
    if (!value) {
      Notify.open({ color: "warning", message: "请先同意服务条款" });
      return;
    }
    const res = await request({
      url: "/order/create",
      data: { scaleTableCode: router.params.code }
    });

    const payRes = await request({
      url: "/order/pay",
      data: { id: res.data.orderId, ip: "127.0.0.1" }
    });

    const checkPay = async () => {
      const res = await request({
        url: "/order/check",
        data: { scaleTableCode: router.params.code }
      });
      if (!res.data.hasPaidOrder) {
        navigateTo({ url: `/orderPackage/pages/order/gmsPay` });
      } else {
        if (childContext.child.len) {
          navigateTo({
            url: `/pages/child/choose?code=${router.params.code}&orderId=${res.data.orderId}`
          });
        } else {
          navigateTo({ url: "/pages/child/manage" });
        }
      }
    };

    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success(res) {
        Notify.open({ color: "success", message: "支付成功" });
        checkPay();
        console.log("🚀 ~ file: gmsPay.tsx ~ line 40 ~ success ~ res", res);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleTable/price",
        data: { code: router.params.code }
      });
      setPrice(res.data.price);
      console.log("🚀 ~ file: gmsPay.tsx ~ line 51 ~ res22", res);
    })();
  }, []);

  return (
    <View className="index">
      <Box
        title={
          <View>
            <Image src={Book} className="icon" />
            GMs评估的重要性
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View className="desc">
          GMs自评建议将对宝宝面临的脑发育风险程度给出相应的类别，为您决定是否尽快就医诊治提供参考，GMs自评不属于医疗看诊，无法代替医生面诊，敬请您知晓。通过专业的高质星GMs评估和就诊后的综合检查可以尽早有效诊断宝宝的脑发育是否健康，是否需要早期康复干预。通过GMs的有效鉴别，既能避免健康宝宝盲目接受康复，又能为发育落后的宝宝抓住早期康复干预的黄金时期。
        </View>
      </Box>
      <Box
        title={
          <View>
            <Image src={Psy} className="icon" />
            专家评估
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View className="desc">
          行业顶级专家团队针对筛查结果进行评估，为孩子健康发育保驾护航
        </View>
      </Box>
      <Box
        title={
          <View>
            <Image src={Cny} className="icon" />
            付费标准
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View className="desc">
          <View className="price">{price}元/次</View>
          <View className="sub-desc">
            *量表筛直为一次性消费产品，一旦购买概不退换
          </View>
        </View>
      </Box>
      <View className="agreement">
        <Checkbox shape="square" checked={value} onChange={setValue} size={18}>
          <View className="read">我己阅读并同意 </View>
        </Checkbox>
        <Text className="buy" onClick={() => setOpen(true)}>
          《购买服务条款》
        </Text>
      </View>
      <Popup
        defaultOpen
        placement="bottom"
        style={{ height: "100%" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popup.Close />
        <View className="head">GMs新生婴儿脑发育风险自评服务条款</View>
        <View className="body">
          <View className="title">服务条款总则</View>
          <View className="content">
            1.任何使用GMs新生婴儿脑发育风险自评APP软件(简称GMs自评软件)的用户均应仔细阅读本服务条款，用户使用本软件的行为将被视为对服务条款全部内容的认可并接受;
          </View>
          <View className="content">
            2.GMs自评软件是关于4月龄以内小婴儿家长用户进行GMs脑发育风险自评的平台，
            <Text style={{ color: "#F44336" }}>
              本软件的自评报告仅供参考，不能作为医疗诊断和治疗的直接依据;
            </Text>
          </View>
          <View className="content">
            3.GMs风险自评只是儿童吃发育健康咨询领域的一种初步方法，不能仅仅依靠GMs自评结果判断小婴儿的脑发育状况;
          </View>
          <View className="content">
            4.随着宝宝出生后发育长大，相隔数周的多次GMs自评能够更为清晰的了解宝宝脑发育的情况及其变化;
          </View>
          <View className="content">5.自评费用一旦支付将不予退回;</View>
          <View className="content">
            6.我们将在必要时修改服务条款，如果家长用户继续使用本软件提供的服务，则被视为接受服务条款变动。我们保留修改服务条款的权利，不需知照家长用户或第三方。
          </View>

          <View className="title">免责声明</View>
          <View className="content">
            1.家长用户应该理解GMs自评不属于医疗看诊，无法代替医生面诊，因此GMs自评报告仅供参考，具体诊疗请一定要到医院由相关医生完成;
          </View>
          <View className="content">
            2.我们不承担因家长用户自身过错、网络状况、通讯线路等任何技术原因或其他不可控原因而导致不能正常进行GMs自评以及因此引起的损失，亦不承担任何相关法律责任。
          </View>

          <View className="title">其他说明</View>
          <View className="content">
            1.家长客户应提供真实、正确的信息资料并耐心完成自评;
          </View>
          <View className="content">
            2.用户名
            登录密码和支付密码只允许家长用户使用，不得将登录密码和支付密码公开或提供给第三方，家长用户将对用户名、登录密码和支付密码的安全负有全部责任。另外，每个家长用户都要对以其用户名进行的所有活动和事件负全责;
          </View>
          <View className="content">
            3.我们对家长上传的信息、资料以及自评建议等资料的保存期限为完成自评后的6个月。
          </View>
        </View>
      </Popup>
      <Button
        onClick={buy}
        style={{ width: "100%", marginTop: 20 }}
        color="primary"
      >
        立即购买
      </Button>
      <Notify id="notify" />
    </View>
  );
}
