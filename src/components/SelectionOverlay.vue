<template>
  <div v-if="visible" class="overlay" @mousedown="startSelection" @mousemove="updateSelection" @mouseup="endSelection">
    <div v-if="isSelecting" class="selection-box" :style="selectionBoxStyle"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,      // 是否显示选择框组件
      isSelecting: false,  // 是否正在框选中
      startX: 0,           // 框选起始点 X 坐标
      startY: 0,           // 框选起始点 Y 坐标
      endX: 0,             // 框选结束点 X 坐标
      endY: 0              // 框选结束点 Y 坐标
    };
  },
  computed: {
    // 计算选择框的样式
    selectionBoxStyle() {
      const width = Math.abs(this.endX - this.startX);
      const height = Math.abs(this.endY - this.startY);
      const left = Math.min(this.startX, this.endX);
      const top = Math.min(this.startY, this.endY);
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`
      };
    }
  },
  methods: {
    startSelection(event) {
      this.isSelecting = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    updateSelection(event) {
      if (!this.isSelecting) return;
      this.endX = event.clientX;
      this.endY = event.clientY;
    },
    endSelection() {
      this.isSelecting = false;
      const selectionArea = {
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      this.$emit('selection-complete', selectionArea);
      this.visible = false; // 选择完成后隐藏遮罩层
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3); /* 半透明背景 */
  cursor: crosshair;              /* 鼠标样式 */
  z-index: 9999;                  /* 置顶 */
}

.selection-box {
  position: absolute;
  border: 2px dashed #007bff;
  background: rgba(0, 123, 255, 0.2);
}
</style>
