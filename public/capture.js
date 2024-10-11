const { ipcRenderer } = require('electron');

const canvas = document.getElementById('screen-canvas');
const ctx = canvas.getContext('2d');
let screenSourceId;
let screenImage; // 用于保存捕获到的屏幕图像

// 接收主进程发送的屏幕源 ID，并启动屏幕捕获
ipcRenderer.on('screen-source-id', async (event, sourceId) => {
  screenSourceId = sourceId;
  await captureScreen(screenSourceId); // 捕获并显示图像
});

// 使用 navigator.mediaDevices 捕获屏幕图像，并在 canvas 上显示
async function captureScreen(sourceId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
        },
      },
    });

    const video = document.createElement('video');
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 捕获视频帧到 canvas 中，并保存屏幕图像数据
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      screenImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // 保存当前图像
      stream.getTracks()[0].stop(); // 停止视频流
    };
  } catch (e) {
    console.error('屏幕捕获失败：', e);
  }
}

// 初始化鼠标选择区域参数
let isSelecting = false;
let startX, startY, endX, endY;

// 处理鼠标按下事件，记录起点
canvas.addEventListener('mousedown', (e) => {
  console.log('鼠标按下：', e.clientX, e.clientY);
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  // 每次重新绘制时清空整个 canvas，并重绘屏幕图像
  ctx.putImageData(screenImage, 0, 0); // 恢复原始图像
});

// 处理鼠标移动事件，动态绘制矩形选择区域
canvas.addEventListener('mousemove', (e) => {
  if (!isSelecting) return;

  endX = e.clientX;
  endY = e.clientY;

  // 清空并重新绘制原始屏幕图像
  ctx.putImageData(screenImage, 0, 0);

  // 计算选择区域的位置和大小
  const rectWidth = Math.abs(endX - startX);
  const rectHeight = Math.abs(endY - startY);
  const rectX = Math.min(startX, endX);
  const rectY = Math.min(startY, endY);

  // 绘制半透明的选择矩形
  ctx.strokeStyle = '#007bff'; // 边框颜色
  ctx.lineWidth = 2;           // 边框宽度
  ctx.fillStyle = 'rgba(0, 123, 255, 0.2)'; // 填充颜色

  ctx.fillRect(rectX, rectY, rectWidth, rectHeight); // 绘制填充的矩形
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight); // 绘制矩形边框
});

// 处理鼠标抬起事件，完成选择区域并裁剪图像
canvas.addEventListener('mouseup', () => {
  console.log('鼠标抬起：', endX, endY);
  isSelecting = false;

  // 计算最终的选择区域
  const rectWidth = Math.abs(endX - startX);
  const rectHeight = Math.abs(endY - startY);
  const rectX = Math.min(startX, endX);
  const rectY = Math.min(startY, endY);

  // 创建一个新的 canvas 来裁剪选中的区域
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = rectWidth;
  croppedCanvas.height = rectHeight;
  const croppedCtx = croppedCanvas.getContext('2d');

  // 将选择的区域绘制到新 canvas 中
  croppedCtx.drawImage(canvas, rectX, rectY, rectWidth, rectHeight, 0, 0, rectWidth, rectHeight);

  // 获取裁剪后的图像数据，并发送给主进程
  const croppedImage = croppedCanvas.toDataURL('image/png');
  ipcRenderer.send('end-capture', croppedImage);
});
