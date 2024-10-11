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
import { ipcRenderer, clipboard } from "electron";

export default {
  data() {
    return {
      tools: [
        {
          name: "OCR文字识别",
          description: "截取屏幕并识别屏幕上的文字",
          icon: require("@/assets/ocr-icon.png"),
        },
        {
          name: "图片OCR文字识别",
          description: "上传本地图片并识别文字",
          icon: require("@/assets/ocr-icon.png"),
        },
      ],
    };
  },
  methods: {
    startTool(tool) {
      if (tool.name === "OCR文字识别") {
        ipcRenderer.send('start-capture');
      } else if (tool.name === "图片OCR文字识别") {
        ipcRenderer.send('open-file-dialog'); // 触发主进程的文件选择对话框
      }
    },

    // 处理文件选择事件并调用 OCR 接口
    handleFileSelect(fileInfo) {
      if (fileInfo.success && fileInfo.filePath) {
        console.log("选中的文件路径：", fileInfo.filePath);
        this.uploadAndRecognize(fileInfo.filePath, fileInfo.fileContent);
      } else {
        console.warn("文件选择失败或未选择文件");
      }
    },

    // 上传文件并调用 OCR 接口进行识别
    uploadAndRecognize(filePath, fileContent) {
      const apiUrl = "http://192.168.14.48:5000/ocr";
      const formData = new FormData();
      const blob = new Blob([fileContent], { type: "image/jpeg" }); // 将 Buffer 转换成 Blob 对象

      // 将 Blob 作为文件对象上传
      formData.append("file", blob, filePath.split('/').pop());

      axios
        .post(apiUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data && response.data.text) {
            clipboard.writeText(response.data.text); // 识别结果拷贝至剪贴板
            alert("识别成功！内容已拷贝至剪贴板。");
          } else {
            alert("识别失败，未识别到文字内容。");
          }
        })
        .catch((error) => {
          console.error("OCR API 调用失败：", error);
          alert("OCR 识别失败，请检查接口或文件格式。");
        });
    },
  },

  mounted() {
    // 监听主进程的文件选择结果
    ipcRenderer.on('selected-file', (event, fileInfo) => {
      this.handleFileSelect(fileInfo);
    });

    ipcRenderer.on('image-captured', (event, croppedImage) => {
      this.onImageCaptured(croppedImage);
    });
  },

  beforeDestroy() {
    ipcRenderer.removeAllListeners('selected-file');
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
