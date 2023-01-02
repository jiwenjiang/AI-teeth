import React from "react";
import { View } from "@tarojs/components";

import styles from "./index.module.scss";

export default function LoadMore({
  page,
  totalPage,
}: {
  page: number,
  totalPage: number,
}) {

  return (
    <View className={styles.loadmore}>{page < totalPage ? '上拉加载更多' : '已全部加载'}</View>
  );
}
