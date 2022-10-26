import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import { List, Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import { navigateTo, usePageScroll } from "@tarojs/taro";
import React, { useRef, useState } from "react";
import styles from "./recordList.module.scss";

export default function App() {
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const total = useRef(1);
  const params = useRef({ pageNo: 0, pageSize: 10, patientId: null });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");

  usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      setLoading(true);
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    } else {
      setHasMore(false);
    }
  };

  const getList = async (init?: boolean) => {
    const res = await request({
      url: "/scaleRecord/list",
      data: params.current
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.records : [...data, ...res.data?.records]);
    isLoading.current = false;
    setLoading(false);
  };

  const goReport = item => {
    if (item.scaleTableCode === ScaleTableCode.BRAIN) {
      navigateTo({
        url: `/pages/evaluate/brainDetail?id=${item.id}`
      });
    }
    if (item.scaleTableCode === ScaleTableCode.GMS) {
      navigateTo({
        url: `/pages/evaluate/gmsDetail?id=${item.id}`
      });
    }
    if (item.scaleTableCode === ScaleTableCode.BRAIN_GMS) {
      navigateTo({
        url: `/pages/evaluate/brainGmsDetail?id=${item.id}`
      });
    }
  };

  return (
    <View className={styles.index}>
      <List
        loading={loading}
        hasMore={hasMore}
        scrollTop={scrollTop}
        onLoad={onLoad}
      >
        {data?.map((item, i) => (
          <View className={styles.box} key={i}>
            <Card
              data={item}
              detail={() =>
                navigateTo({
                  url: `/pages/evaluate/detail?id=${item.id}`
                })
              }
              report={() => goReport(item)}
            ></Card>
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
        </List.Placeholder>
      </List>
    </View>
  );
}

function Card({ data, report, detail }) {
  const toReport = () => {
    report?.(data);
  };

  const toDetail = () => {
    detail?.(data);
  };

  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.scaleName}>{data?.scaleName}</View>
        <View className={styles.kv}>
          <View className={styles.k}>量表类型</View>
          <View className={styles.v}>{data?.scaleClassification}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>自测时间</View>
          <View className={styles.v}>{data?.time}</View>
        </View>
        <View className={styles.btnbox}>
          <View
            className={styles.btn}
            style={{ borderRight: "1px solid #f0f0f0" }}
            onClick={() => toReport()}
          >
            查看报告
          </View>
          <View className={styles.btn} onClick={() => toDetail()}>
            量表详情
          </View>
        </View>
      </View>
    </View>
  );
}
