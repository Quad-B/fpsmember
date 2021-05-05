const { app, BrowserWindow, ipcMain, Notification  } = require('electron')
const Nucleus = require('nucleus-nodejs')
Nucleus.init('60192024a595e240f55fd03a')

const RPC = require('discord-rpc');
const rpc = new RPC.Client({
  transport: "ipc"
});

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=1024')

rpc.on("ready", () =>{
  rpc.setActivity({
    details: "อยู่ใน FPSMember Desktop App",
    state: "Member.FPSThailand.com",
    startTimestamp: new Date(),
    largeImageKey: "fpsmember",
    largeImageText: "FPSMember",
    smallImageKey: "fpsmember",
    smallImageText: "FPSMember"
  });

  //console.log("Rich presence is now active");
});

rpc.login({
  clientId: "831886897537482773"
});

let win;
let ses;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')

  win.maximize()

  //win.webContents.openDevTools()

  ses = win.webContents.session

  Nucleus.appStarted()
}

app.commandLine.appendSwitch('disable-site-isolation-trials')

ipcMain.on('clearlogin', () => {
  ses.clearCache()
  ses.clearStorageData()
  win.reload()
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