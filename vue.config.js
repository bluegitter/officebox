const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      builderOptions: {
        appId: 'com.officebox.app',
        productName: 'OfficeBox', // 项目名称
        win: {
          target: ['nsis', 'portable'], // 指定打包类型
          icon: 'public/icon.ico'
        }
      }
    }
  }
})

