'use strict'

import { app, protocol, BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { initialize, enable } from '@electron/remote/main';  // 使用 ES 模块导入
import path from 'path';
initialize();  // 初始化 remote 模块

const isDevelopment = process.env.NODE_ENV !== 'production'

if (!desktopCapturer) {
  console.error("desktopCapturer 模块未加载，可能是 Electron 配置问题。");
} else {
  console.log("desktopCapturer 模块已加载，可以正常使用。");
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let mainWindow;
let captureWindow;
async function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      nodeIntegration: true,
      contextIsolation: false, // 禁用上下文隔离
      enableRemoteModule: true, // 允许使用 remote 模块
    }
  })
  enable(mainWindow.webContents);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }


}

// 创建截屏窗口
function createCaptureWindow(screenSourceId) {
  // 获取当前屏幕的大小
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  captureWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const captureHtmlPath = path.join(__dirname, '../public/capture.html');
  captureWindow.loadFile(captureHtmlPath); // 确保使用 __dirname 来构建文件路径
  captureWindow.show();

  // 在页面加载完成后，将屏幕源 ID 发送到 `captureWindow`
  captureWindow.webContents.on('did-finish-load', () => {
    captureWindow.webContents.send('screen-source-id', screenSourceId);
  });
}

// 使用 desktopCapturer 获取屏幕源 ID
async function getScreenSourceId() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  return sources[0].id; // 获取第一个屏幕的 ID
}

// 监听主窗口的截屏请求
ipcMain.on('start-capture', async () => {
  const screenSourceId = await getScreenSourceId(); // 获取屏幕源 ID
  createCaptureWindow(screenSourceId); // 创建并显示截屏窗口，并传递屏幕源 ID
});

// 监听裁剪完成事件
ipcMain.on('end-capture', (event, croppedImage) => {
  if (captureWindow) {
    captureWindow.close();
    mainWindow.webContents.send('image-captured', croppedImage); // 将裁剪后的图像发送回主窗口
  }
});

// 创建主窗口
app.whenReady().then(createMainWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});