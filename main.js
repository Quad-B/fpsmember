const { app, BrowserWindow, session, ipcMain, Notification} = require('electron')
const {autoUpdater} = require("electron-updater");

require('@electron/remote/main').initialize()

const Nucleus = require('nucleus-nodejs')
Nucleus.init('60192024a595e240f55fd03a')

/*const RPC = require('discord-rpc');
const rpc = new RPC.Client({
  transport: "ipc"
});

rpc.on("ready", () =>{
  /*rpc.setActivity({
    details: "อยู่ใน FPSMember Desktop App",
    state: "Member.FPSThailand.com",
    startTimestamp: new Date(),
    largeImageKey: "fpsmember",
    largeImageText: "FPSMember",
    smallImageKey: "fpsmember",
    smallImageText: "FPSMember"
  });*/
  //autoUpdater.autoInstallOnAppQuit = true;
  //console.log("Rich presence is now active");
/*});

rpc.login({
  clientId: "831886897537482773"
});*/

let win;
let ses;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    //autoHideMenuBar: true,
    autoHideMenuBar: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')

  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.checkForUpdatesAndNotify();

  win.maximize()

  win.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
    (d, c)=>{
      if(d.responseHeaders['X-Frame-Options']){
        delete d.responseHeaders['X-Frame-Options'];
      } else if(d.responseHeaders['x-frame-options']) {
        delete d.responseHeaders['x-frame-options'];
      }

      c({cancel: false, responseHeaders: d.responseHeaders});
    }
  );

  //win.webContents.openDevTools()

  require("@electron/remote/main").enable(win.webContents)

  ses = win.webContents.session

  Nucleus.appStarted()
}

ipcMain.on('clearlogin', () => {
  ses.clearCache()
  ses.clearStorageData()
  win.reload()
});

app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')

autoUpdater.on('update-not-available', () => {
});

autoUpdater.on('update-available', () => {
  new Notification({title: 'โปรแกรมมีอัพเดต',body: 'กำลังทำการอัพเดตในพื้นหลัง'}).show()
  autoUpdater.downloadUpdate();
});

autoUpdater.on('download-progress', () => {
});

autoUpdater.on('update-downloaded', () => {
  new Notification({title: 'อัพเดตเสร็จเรียบร้อย',body: 'เวอร์ชั่นใหม่จะใช้ได้ในการเปิดครั้งต่อไป'}).show()
});

autoUpdater.on('error', (error) => {
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
