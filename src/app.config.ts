export default {
  pages: [
    "pages/index/index",
    "pages/mine/index",
    "pages/mine/setting",
    "pages/mine/password",
    "pages/mine/info",
    "pages/login/index",
    "pages/child/choose",
    "pages/child/manage",
    "pages/child/edit",
    "pages/evaluate/list",
    "pages/evaluate/index",
    "pages/evaluate/step",
    "pages/evaluate/stepDetail",
    "pages/evaluate/brainDetail",
    "pages/evaluate/interventionList",
    "pages/evaluate/interventionDetail",
    "pages/evaluate/gmsDetail",
    "pages/evaluate/brainGmsDetail",
    "pages/evaluate/detail",
    "pages/evaluate/recordList",
    "pages/other/webView"
  ],
  subpackages: [
    {
      root: "orderPackage",
      pages: [
        "pages/order/scale",
        "pages/order/detail",
        "pages/order/gmsPay",
        "pages/order/videoList"
      ]
    }
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    custom: true,
    color: "#000000",
    selectedColor: "#DC143C",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页"
      },
      {
        pagePath: "pages/mine/index",
        text: "个人中心"
      }
    ]
  }
};
