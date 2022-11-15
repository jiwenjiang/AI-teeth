export default {
  pages: [
    "pages/index/index",
    "pages/mine/index",
    "pages/caries/index",
    "pages/caries/photo",
    "pages/caries/report",
    "pages/caries/warningReport"
  ],
  subpackages: [
    {
      root: "packages/login",
      pages: ["index", "terms"]
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
