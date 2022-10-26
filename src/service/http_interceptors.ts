import { addInterceptor, Chain, getStorageSync } from "@tarojs/taro";

async function headerInterceptor(chain: Chain) {
  const req = chain.requestParams;
  req["header"] = {
    ...req["header"],
    "recovery-token": getStorageSync("token")
  };
  let res;
  try {
    res = await chain.proceed(req);
  } catch (error) {
    handleErr(error);
  }
  return res;
}

function handleErr(err) {
  console.log(
    "🚀 ~ file: http_interceptors.ts ~ line 19 ~ handleErr ~ err",
    err
  );
}



addInterceptor(headerInterceptor);
