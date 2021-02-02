const { app, BrowserWindow, ipcMain, Notification  } = require('electron')

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
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')

  win.maximize()

  //win.webContents.openDevTools()

  ses = win.webContents.session
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