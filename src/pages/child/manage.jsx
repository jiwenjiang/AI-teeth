import { ChildContext } from "@/service/context";
import request from "@/service/request";
import editImg from "@/static/imgs/edit.png";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import removeImg from "@/static/imgs/remove.png";
import { Button, Notify } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useContext, useEffect, useState } from "react";

import "./manage.scss";

export default function App() {
  const router = useRouter();
  const [updateFlag, setUpdateFlag] = useState(Date.now());
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [children, setChildren] = useState([]);
  const [dataIndex, setDataIndex] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const childContext = useContext(ChildContext);

  // 页面加载时调用该方法获取儿童信息
  useEffect(() => {
    getChildrenList();
  }, [updateFlag]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChildren(res.data.children);
    childContext.updateChild({ len: res.data.children.length });
  };

  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    navigateTo({
      url: `/pages/child/edit?code=${router.params.code}`
    });
  };
  // 跳转至添加儿童页面，并带上儿童 ID，以编辑儿童信息
  const edit = index => {
    navigateTo({
      url: `/pages/child/edit?childId=${children[index].id}`
    });
  };

  // 显示删除儿童信息对话框
  const showRemove = index => {
    setDataIndex(index);
    setShowRemoveModal(true);
  };

  // 删除当前儿童信息
  const doRemove = async index => {
    const res = await request({
      url: `/children/delete?id=${children[index].id}`
    });

    setShowRemoveModal(false);

    if (res.code === 0) {
      children.splice(
        children.findIndex(ele => ele.id === dataIndex),
        0
      );
      setChildren(children);
      Notify.open({ color: "success", message: "儿童信息已删除" });
      setUpdateFlag(Date.now());
    } else {
      Notify.open({ color: "danger", message: "儿童信息删除失败" });
    }
  };

  return (
    <View className="index">
      <Notify id="notify" />
      <View className="list-wrap">
        <View className="list">
          {children.map((v, index) => (
            <View key={index} className="child-info">
              <View className="left">
                <Image
                  src={v.gender === "男" ? maleImg : femaleImg}
                  className="gender"
                />
                <View className="text-info">
                  <Text className="name">{v.name}</Text>
                  <Text className="birthday">{v.birthday}</Text>
                </View>
              </View>
              <View className="actions">
                <Image
                  onClick={() => showRemove(index)}
                  src={removeImg}
                  className="action remove"
                />
                <Image
                  onClick={() => edit(index)}
                  src={editImg}
                  className="action edit"
                />
              </View>
            </View>
          ))}
        </View>
        <View className="actions">
          <Button className="btn" color="primary" onClick={add}>
            添加儿童
          </Button>
        </View>
      </View>
      {showRemoveModal && (
        <View className="remove-modal">
          <View className="mask"></View>
          <View className="modal">
            <View className="text">
              确认删除儿童{children[dataIndex].name}？
            </View>
            <View className="actions">
              <View
                onClick={() => setShowRemoveModal(false)}
                className="action cancel"
              >
                取消
              </View>
              <View
                onClick={() => doRemove(dataIndex)}
                className="action confirm"
              >
                删除
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
