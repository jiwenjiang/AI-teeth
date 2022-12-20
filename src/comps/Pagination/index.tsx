import React from "react";
import { cls } from "reactutils";
import { View } from "@tarojs/components";

import styles from "./index.module.scss";

export default function Pagination({
  page,
  totalPage,
  onPrevPage,
  onNextPage,
}: {
  page: number,
  totalPage: number,
  onPrevPage: Function;
  onNextPage: Function;
}) {
  const handlePrevPage = () => {
    onPrevPage?.();
  }
  const handleNextPage = () => {
    onNextPage?.();
  }

  return (
    <View className={styles.pagination}>
      <View className={cls(styles['page-btn'], page === 1 && styles['opacity-0'])} onClick={handlePrevPage}>
        上一页
      </View>
      <View className={styles['current-page']}>第{page}页 / 共{totalPage}页</View>
      <View className={cls(styles['page-btn'], page === totalPage && styles['opacity-0'])} onClick={handleNextPage}>
        下一页
      </View>
    </View>
  );
}
