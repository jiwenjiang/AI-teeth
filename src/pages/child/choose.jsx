import ListItem from "@/comps/ListItem";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import Select from "@/static/icons/selected.svg";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Button, Notify } from "@taroify/core";
import { Image, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { useState } from "react";
import "./choose.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 1000 });
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);

  const start = () => {
    let age = dayjs().diff(dayjs(data[active]?.birthday), "month");
    if (
      age > 5 &&
      (Number(router.params.code) === ScaleTableCode.GMS ||
        Number(router.params.code) === ScaleTableCode.BRAIN_GMS)
    ) {
      Notify.open({ color: "warning", message: "GMs评测仅限0-5个月孩子" });
      return;
    }
    if (
      [
        ScaleTableCode.BRAIN,
        ScaleTableCode.GMS,
        ScaleTableCode.BRAIN_GMS
      ].includes(Number(router.params.code))
    ) {
      navigateTo({
        url: `/pages/evaluate/index?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`
      });
    } else {
      navigateTo({
        url: `/pages/evaluate/step?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`
      });
    }
  };

  const manage = () => {
    navigateTo({ url: "/pages/child/manage" });
  };

  const choose = (_v, i) => {
    setActive(i);
  };

  useDidShow(() => {
    (async () => {
      const res = await request({ url: "/children/list", data: page });
      setData(res.data.children);
    })();
  });

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list">
          {data.map((v, i) => (
            <View key={i} className="list-item-wrap">
              <ListItem
                title={v.name}
                subTitle={v.birthday}
                click={() => choose(v, i)}
                left={
                  <Image
                    src={v.gender === "男" ? maleImg : femaleImg}
                    className="gender"
                  />
                }
                right={
                  active === i && (
                    <View className="arrow-icon">
                      <Image src={Select} className="select" />
                    </View>
                  )
                }
              />
            </View>
          ))}
        </View>
        {data.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            shape="square"
            onClick={start}
            className="taro-btn"
          >
            开始评测
          </Button>
        )}
        <Button
          variant="contained"
          shape="square"
          onClick={manage}
          className="taro-btn mt10"
        >
          儿童管理
        </Button>
      </View>
      <Notify id="notify" />
    </View>
  );
}
