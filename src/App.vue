<template>
  <div id="app">
    <!-- <nav> -->
      <!-- <router-link to="/">Home</router-link> -->
      <!-- 添加更多链接 -->
      <!-- <router-link to="/about">About</router-link> -->
    <!-- </nav> -->
    <!-- 渲染当前路由匹配的组件 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* 你可以在这里添加全局样式 */
nav {
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
nav a {
  margin: 0 0px;
  text-decoration: none;
  color: #007bff;
}
nav a:hover {
  text-decoration: underline;
}
body {
  margin: 0;
}
</style>
