<template>
  <div class="home">
    <SidebarMenu />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SidebarMenu from "@/components/SidebarMenu.vue";

export default {
  components: {
    SidebarMenu,
  }
};
</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
}
.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
