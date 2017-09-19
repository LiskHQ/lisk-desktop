const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const buildMenu = require('./menu');

const { app } = electron;
const { BrowserWindow } = electron;
const { Menu } = electron;

let win;
let isUILoaded = false;
let eventStack = [];

const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
const protocolName = 'lisk';

const sendUrlToRouter = (url) => {
  if (isUILoaded && win && win.webContents) {
    win.webContents.send('openUrl', url);
  } else {
    eventStack.push({ event: 'openUrl', value: url });
  }
};

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width > 2000 ? Math.floor(width * 0.5) : width - 250,
    height: height > 1000 ? Math.floor(height * 0.7) : height - 150,
    center: true,
    webPreferences: {
      // Avoid app throttling when Electron is in background
      backgroundThrottling: false,
      // Specifies a script that will be loaded before other scripts run in the page.
      preload: path.resolve(__dirname, 'ipc.js'),
    },
  });
  win.on('blur', () => win.webContents.send('blur'));
  win.on('focus', () => win.webContents.send('focus'));

  if (process.platform === 'win32') {
    sendUrlToRouter(process.argv.slice(1));
  }

  Menu.setApplicationMenu(buildMenu(app, copyright));

  win.loadURL(`file://${__dirname}/dist/index.html`);

  win.on('closed', () => { win = null; });

  const selectionMenu = Menu.buildFromTemplate([
    { role: 'copy' },
    { type: 'separator' },
    { role: 'selectall' },
  ]);

  const inputMenu = Menu.buildFromTemplate([
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'selectall' },
  ]);

  win.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(win);
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(win);
    }
  });

  // Resolve all events from stack when dom is ready
  win.webContents.on('did-finish-load', () => {
    isUILoaded = true;
    if (eventStack.length > 0) {
      eventStack.forEach(({ event, value }) => win.webContents.send(event, value));
      eventStack = [];
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This will override the values defined in the app’s .plist file (macOS)
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'Lisk Nano',
    copyright,
  });
}

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// Set app protocol
app.setAsDefaultProtocolClient(protocolName);

// Force single instance application
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (process.platform === 'win32') {
    sendUrlToRouter(argv.slice(1));
  }
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

app.on('will-finish-launching', () => {
  // Protocol handler for MacOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    sendUrlToRouter(url);
  });
});
