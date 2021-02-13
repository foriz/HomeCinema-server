const config = require('../core/config/config.json')

const { app, BrowserWindow, ipcMain } = require('electron')
const server = require('../core/app.js');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('ui/admin.html')
  //win.webContents.openDevTools()
}

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

ipcMain.on('synchronous-message', (event, arg) => {
  if(arg == 'config') {
    event.returnValue = config
  }
  else  {
    return null
  }
})