const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const { app } = electron;
const { BrowserWindow } = electron;
const { Menu } = electron;

let win;

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width - 250,
    height: height - 150,
    center: true,
  });

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'togglefullscreen',
        }
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          role: 'minimize',
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Lisk Website',
          click: function () {
            electron.shell.openExternal('https://lisk.io');
          }
        },
        {
          label: 'Lisk Chat',
          click: function () {
            electron.shell.openExternal('https://lisk.chat');
          }
        },
        {
          label: 'Lisk Forum',
          click: function () {
            electron.shell.openExternal('https://forum.lisk.io');
          }
        },
        {
          type: 'separator',
        },
        {
          label: 'Report Issue...',
          click: function () {
            electron.shell.openExternal('https://github.com/LiskHQ/lisk-nano/issues/new');
          }
        },
        {
          label: 'What\'s New...',
          click: function () {
            electron.shell.openExternal('https://github.com/LiskHQ/lisk-nano/releases');
          }
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();

    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about',
          label: 'About',
        },
        {
          role: 'quit',
          label: 'Quit',
        },
      ],
    });
  } else {
    template[template.length - 1].submenu.push({
      label: 'About',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          const options = {
            buttons: ['OK'],
            icon: `${__dirname}/assets/lisk.png`,
            message: `Lisk Nano\nVersion ${app.getVersion()}\nCopyright © 2017 Lisk Foundation`,
          }
          electron.dialog.showMessageBox(focusedWindow, options, function () {})
        }
      }
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.loadURL(`file://${__dirname}/dist/index.html`);

  win.on('closed', () => win = null);

  setupContextMenu(win);
}

function setupContextMenu(window) {
  const selectionMenu = Menu.buildFromTemplate([
    {role: 'copy'},
    {type: 'separator'},
    {role: 'selectall'},
  ]);

  const inputMenu = Menu.buildFromTemplate([
    {role: 'undo'},
    {role: 'redo'},
    {type: 'separator'},
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'},
    {type: 'separator'},
    {role: 'selectall'},
  ]);

  window.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(window);
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(window);
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
