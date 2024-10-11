<template>
  <div class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.name">
        <router-link :to="item.route">
          <img :src="require(`@/assets/${item.icon}`)" alt="icon" />
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: '首页', route: '/pdf-tools',icon: 'home-icon.png' },
        { name: 'PDF工具集', route: '/pdf-tools', icon: 'pdf-icon.png' },
        { name: '格式转换工具集', route: '/pdf-tools',icon: 'convert-icon.png' },
        { name: '图像处理工具', route: '/pdf-tools',icon: 'image-icon.png' },
        { name: 'OCR识别工具集',route: '/ocr-tools', icon: 'ocr-icon.png' },
        { name: '屏幕录制工具',route: '/pdf-tools', icon: 'record-icon.png' },
        { name: '更多办公工具', route: '/pdf-tools',icon: 'more-icon.png' }
      ]
    };
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #007bff; /* 将背景修改为蓝色 */
  flex-shrink: 0; 
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  padding: 15px 20px;
}
a {
  text-decoration: none;
  color: #ffffff; /* 将字体颜色改为白色 */
  display: flex;
  align-items: center;
}
a:hover {
  background-color: #0056b3; /* 添加鼠标悬停效果 */
  border-radius: 4px;
}
img {
  width: 20px;
  margin-right: 10px;
}
</style>
