import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import electronLocalshortcut from 'electron-localshortcut'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import i18n from './i18n';
import buildMenu from './menu';
import {
  sendEventsFromEventStack,
  createNewBrowserWindow,
  sendUrlToRouter,
  sendLanguage,
  menuPopup,
} from './utils';

const { app, Menu, ipcMain, BrowserWindow } = electron;
const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
let eventStack = [];
let win;

const createWindow = () => {
  sendLanguage({ storage, win, eventStack });

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  win = createNewBrowserWindow({ width, height, BrowserWindow, path });

  win.on('blur', () => win.webContents.send('blur'));
  win.on('focus', () => win.webContents.send('focus'));

  if (process.platform !== 'darwin') {
    sendUrlToRouter({ url: process.argv[1] || '/', win, eventStack });
  }

  Menu.setApplicationMenu(buildMenu(app, copyright, i18n));
  win.loadURL(`file://${__dirname}/index.html`);

  // Enables DevTools
  win.devtools = true;
  electronLocalshortcut.register(win, 'CmdOrCtrl+Shift+I', () => {
    win.webContents.toggleDevTools();
  });

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

  win.webContents.on('context-menu', (e, props) => { menuPopup({ props, selectionMenu, inputMenu, win }); });

  // Resolve all events from stack when dom is ready
  win.webContents.on('did-finish-load', () => {
    win.isUILoaded = true;
    eventStack = sendEventsFromEventStack({ eventStack, win });
  });

  win.on('closed', () => { win = null; });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This will override the values defined in the app’s .plist file (macOS)
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({ applicationName: 'Lisk Nano', copyright });
}

app.on('activate', () => {
  if (win === null) { createWindow(); }
});

// Set app protocol
app.setAsDefaultProtocolClient('lisk');

// Force single instance application
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (process.platform !== 'darwin') {
    sendUrlToRouter({ url: argv[1] || '/', win, eventStack });
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
    sendUrlToRouter({ url, win, eventStack });
  });
});

app.on('login', (event, webContents, request, authInfo, callback) => {
  global.myTempFunction = callback;
  event.preventDefault();
  webContents.send('proxyLogin', authInfo);
});

ipcMain.on('proxyCredentialsEntered', (event, username, password) => {
  global.myTempFunction(username, password);
});

ipcMain.on('set-locale', (event, locale) => {
  const langCode = locale.substr(0, 2);
  if (langCode) {
    i18n.changeLanguage(langCode);
    // write selected lang on JSON file
    storage.set('config', { lang: langCode }, (error) => {
      if (error) throw error;
    });
    Menu.setApplicationMenu(buildMenu(app, copyright, i18n));
    event.returnValue = 'Rebuilt electron menu.';
  }
});

ipcMain.on('request-locale', () => { sendLanguage({ storage, win, eventStack }); });
