
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win

function createWindow () {
  let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    width: width - 250,
    height: height - 150,
    center: true,
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => win = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
