const { app, BrowserWindow, ipcMain, Notification  } = require('electron')
const Nucleus = require('nucleus-nodejs')
Nucleus.init('60192024a595e240f55fd03a')

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