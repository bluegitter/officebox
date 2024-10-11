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
export default {
  data() {
    return {
      tools: [
        { name: 'PDF批量转换', description: '批量转换您的PDF文件到Word/PPT/EXCEL/HTML格式', icon: 'pdf-icon.png' },
        { name: '全能屏幕录像', description: '轻松录制电脑屏幕、网络课程、软件操作等', icon: 'record-icon.png' },
        { name: 'PDF合并大师', description: '史上最强的PDF合并工具', icon: 'pdf-icon.png' },
        { name: '文档模板下载', description: '下载Excel、Word办公模板，涵盖多种行业', icon: 'template_icon.png' }
      ]
    };
  },
  methods: {
    startTool(tool) {
      console.log(`启动工具: ${tool.name}`);
    }
  }
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
</style>
