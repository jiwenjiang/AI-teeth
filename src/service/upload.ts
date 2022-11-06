import { MediaType } from "./const";
import { upload } from "./qiniu-upload";
import request from "./request";

const upload2Server = async (file, type: MediaType, uploadCb) => {
  const ext = file.split(".")?.[1];
  const param = { ext: ext ?? "jpg", type };
  const { data } = await request({ url: "/upload/token", data: param });
  const { key, token, bucket } = data;

  upload({
    filePath: file,
    options: {
      key: `${bucket}/${key}`, // 可选
      region: "NCN", // 可选(默认为'ECN')
      uptoken: token // 以下三选一
    },
    before: () => {
      // 上传前
      console.log("before upload");
    },
    success: async res => {
      const { data } = await request({
        url: "/upload/file",
        data: {
          bucket,
          fileName: file,
          key,
          size: file.size ?? 1,
          type
        },
        method: "POST"
      });
      uploadCb(data);
    },
    fail: err => {
      console.log("error:" + err);
    },
    progress: res => {
      // console.log("上传进度", res.progress);
      // console.log("已经上传的数据长度", res.totalBytesSent);
      // console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
    },
    complete: err => {
      // 上传结束
      console.log("upload complete");
    }
  });
};

export default upload2Server;
