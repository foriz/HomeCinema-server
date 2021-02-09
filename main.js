/*
const express = require('express');
var app = express();

app.listen(3100, () => {

});

// API request for discovery connection & heartbeat
app.get("/ping", (req, res, next) => {
  res.json({
    "response": "pong"
  });
});
*/

/**/
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('ui/index.html')
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