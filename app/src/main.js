import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import electronLocalshortcut from 'electron-localshortcut'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import i18n from './i18n';
import buildMenu from './menu';
import Win from './modules/Win';
import {
  sendEventsFromEventStack,
  sendUrlToRouter,
  sendLanguage,
  menuPopup,
} from './utils';

const { app, Menu, ipcMain } = electron;
const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;

const createWindow = () => {
  Win.init({ electron, path });
  sendLanguage({ storage });

  Win.browser.on('blur', () => Win.webContents.send('blur'));
  Win.browser.on('focus', () => Win.webContents.send('focus'));

  if (process.platform !== 'darwin') {
    sendUrlToRouter({ url: process.argv[1] || '/' });
  }

  Menu.setApplicationMenu(buildMenu(app, copyright, i18n));
  Win.browser.loadURL(`file://${__dirname}/index.html`);

  // Enables DevTools
  Win.browser.devtools = true;
  electronLocalshortcut.register(Win.browser, 'CmdOrCtrl+Shift+I', () => {
    Win.browser.webContents.toggleDevTools();
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

  Win.browser.webContents.on('context-menu', (e, props) => { menuPopup({ props, selectionMenu, inputMenu }); });

  // Resolve all events from stack when dom is ready
  Win.browser.webContents.on('did-finish-load', () => {
    Win.isUILoaded = true;
    sendEventsFromEventStack();
  });

  Win.on('closed', () => { Win.browser = null; });
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
  if (Win.browser === null) { createWindow(); }
});

// Set app protocol
app.setAsDefaultProtocolClient('lisk');

// Force single instance application
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (process.platform !== 'darwin') {
    sendUrlToRouter({ url: argv[1] || '/' });
  }
  if (Win.browser) {
    if (Win.browser.isMinimized()) Win.browser.restore();
    Win.browser.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

app.on('will-finish-launching', () => {
  // Protocol handler for MacOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    sendUrlToRouter({ url });
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

ipcMain.on('request-locale', () => { sendLanguage({ storage }); });
