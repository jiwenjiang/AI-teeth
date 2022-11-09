import "@/service/http_interceptors";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import React from "react";
import "./app.scss";
import "./custom-variables.scss";

function App(props) {
  // const { getAuth } = useAuth();
  // const [child, setChild] = useState({ len: 0 });

  // const getChild = async () => {
  //   const res = await request({
  //     url: "/children/list",
  //     data: { pageNo: 1, pageSize: 1000 }
  //   });
  //   setChild({ len: res.data.children?.length });
  // };

  // useDidShow(() => {
  //   getAuth(getChild);
  // });

  return (
    // <ChildContext.Provider value={{ child, updateChild: setChild }}>
    // </ChildContext.Provider>
    <View className="html">{props.children}</View>
  );
}

export default App;
