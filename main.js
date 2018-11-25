
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog


var devices;

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({width: 1600, height: 1200})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {

    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {

  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('open-information-dialog', function (event,arg) {
	//action = arg;
  const options = {
    type: 'info',
    title: 'Information',
    message: "Your campaign will be downloaded to this device",
    buttons: ['Cancel', arg]
  }
  dialog.showMessageBox(options, function (index) {
    event.sender.send('information-dialog-selection', index)
   // console.log('Action:'+ action);
  })
})





