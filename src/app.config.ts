export default {
  pages: [
    "pages/index/index",
    "pages/mine/index"
  ],
  subpackages: [
    {
      root: "packages/login",
      pages: ["index", "terms", "about"]
    },
    {
      root: "packages/caries",
      pages: ["index", "photo", "report", "warningReport"]
    },
    {
      root: "packages/patient",
      pages: ["index"]
    },
    {
      root: "packages/record",
      pages: ["index"]
    },
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
  },
  enableShareAppMessage: true
};
