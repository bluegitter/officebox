<template>
  <div class="tool-list">
    <div class="tool-item" v-for="tool in tools" :key="tool.name">
      <div class="tool-icon">
        <img :src="tool.icon" alt="tool icon" />
      </div>
      <div class="tool-info">
        <h4>{{ tool.name }}</h4>
        <p>{{ tool.description }}</p>
        <button @click="startTool(tool)">开始使用</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ipcRenderer, clipboard } from "electron"; // 使用 @electron/remote 导入 ipcRenderer

export default {
  data() {
    return {
      tools: [
        {
          name: "OCR文字识别",
          description: "截取屏幕并识别屏幕上的文字",
          icon: require("@/assets/ocr-icon.png"),
        },
      ],
    };
  },
  methods: {
    startTool(tool) {
      console.log("ipcRenderer:", ipcRenderer); // 检查 ipcRenderer 是否正确引用
      if (!ipcRenderer) {
        console.error("ipcRenderer 模块未正确加载，可能是 Electron 配置问题。");
        return;
      }
      if (tool.name === "OCR文字识别") {
        // 触发主进程的 start-capture 事件，启动独立的截图窗口
        ipcRenderer.send('start-capture');
      }
    },

    // 当接收到截图完成的消息时处理识别操作
    onImageCaptured(croppedImage) {
      console.log(croppedImage)
      console.log("接收到截图完成的图像数据：", croppedImage);
      this.ocrRecognize(croppedImage)
        .then((recognizedText) => {
          // 将识别结果拷贝到剪贴板
          clipboard.writeText(recognizedText);
          alert("识别成功！内容已拷贝至剪贴板。");
        })
        .catch((error) => {
          console.error("OCR 识别失败：", error);
        });
    },

    // 调用 OCR API 进行识别
    // async ocrRecognize(imageData) {
    //   try {
    //     // 替换为实际的 OCR API 地址和密钥
    //     const apiUrl = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
    //     const accessToken = "your_baidu_access_token"; // 替换为实际的 Access Token

    //     const response = await axios.post(
    //       `${apiUrl}?access_token=${accessToken}`,
    //       { image: imageData.replace(/^data:image\/\w+;base64,/, "") }, // 去掉 base64 头部
    //       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    //     );

    //     if (response.data.words_result) {
    //       return response.data.words_result.map((item) => item.words).join("\n");
    //     } else {
    //       throw new Error("未识别到文字内容");
    //     }
    //   } catch (error) {
    //     console.error("OCR API 调用失败：", error);
    //     return "OCR 识别失败";
    //   }
    // },
    async ocrRecognize(imageData) {
      try {
        // 使用新的本地 OCR API 地址
        const apiUrl = "http://127.0.0.1:5000/ocr";

        // 构造请求数据
        const requestData = {
          image: imageData, // 直接传递 base64 格式的图像数据
        };

        // 调用本地 OCR 接口
        const response = await axios.post(apiUrl, requestData, {
          headers: { "Content-Type": "application/json" }, // 使用 JSON 格式
        });

        // 检查返回结果并提取识别到的文本
        if (response.data && response.data.text) {
          return response.data.text;
        } else {
          throw new Error("未识别到文字内容");
        }
      } catch (error) {
        console.error("OCR API 调用失败：", error);
        return "OCR 识别失败";
      }
    }
  },

  mounted() {
    // 监听来自主进程的 'image-captured' 事件
    ipcRenderer.on('image-captured', (event, croppedImage) => {
      this.onImageCaptured(croppedImage);
    });
  },

  beforeDestroy() {
    // 组件销毁前移除事件监听器
    ipcRenderer.removeAllListeners('image-captured');
  },
};
</script>

<style scoped>
.tool-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.tool-item {
  width: 200px;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px;
  text-align: center;
  background-color: #fff;
}
.tool-icon img {
  width: 50px;
}
.tool-info h4 {
  font-size: 18px;
}
.tool-info p {
  font-size: 14px;
  color: #666;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
