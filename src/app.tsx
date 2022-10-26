import { ChildContext } from "@/service/context";
import "@/service/http_interceptors";
import request from "@/service/request";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import "./app.scss";
import "./custom-variables.scss";
import { useAuth } from "./service/hook";

function App(props) {
  const { getAuth } = useAuth();
  const [child, setChild] = useState({ len: 0 });

  const getChild = async () => {
    const res = await request({
      url: "/children/list",
      data: { pageNo: 1, pageSize: 1000 }
    });
    setChild({ len: res.data.children?.length });
  };

  useDidShow(() => {
    getAuth(getChild);
  });

  return (
    <ChildContext.Provider value={{ child, updateChild: setChild }}>
      <View className="html">{props.children}</View>
    </ChildContext.Provider>
  );
}

export default App;
