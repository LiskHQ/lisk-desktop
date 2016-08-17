
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {Menu} = electron;

let win

function createWindow () {
  let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    width: width - 250,
    height: height - 150,
    center: true,
  })

  let template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'selectall'
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    let name = app.getName()

    template.unshift({
      label: name,
      submenu: [
        {
          role: 'quit',
          label: 'Quit'
        }
      ]
    })
  }

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

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
