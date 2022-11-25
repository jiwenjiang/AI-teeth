import Taro from "@tarojs/taro";

const host = "https://wx-test.fushuhealth.com/largev-teeth-wx";

type Method = "POST" | "GET" | "DELETE";

const request = (options: {
  method?: Method;
  url: string;
  data?: any;
}): Promise<{ code?: number; data?: any; message: string } & Record<
  string,
  any
>> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...options,
      url: `${host}${options.url}`, //获取域名接口地址
      //header中可以监听到token值的变化
      success(request: any) {
        //监听成功后的操作
        if (request.statusCode === 200) {
          if (request.data?.success || request.data?.code === 2 || request.data?.code === 1) {
            resolve(request.data);
          } else {
            Taro.showToast({
              title: request.data?.message,
              icon: "error",
              duration: 500
            });
          }
        } else {
          //如果没有获取成功返回值,把request.data传入到reject中
          reject(request.data);
        }
      },
      fail(error: any) {
        //返回失败也同样传入reject()方法
        reject(error.data);
      }
    });
  });
};

export default request;
