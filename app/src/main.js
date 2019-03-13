import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import electronLocalshortcut from 'electron-localshortcut'; // eslint-disable-line import/no-extraneous-dependencies
import { autoUpdater } from 'electron-updater'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import getPort from 'get-port';
import win from './modules/win';
import './styles.dialog.css';
// import localeHandler from './modules/localeHandler';
import updateChecker from './modules/autoUpdater';
import server from '../server';

require('babel-polyfill'); // eslint-disable-line import/no-extraneous-dependencies
require('./ledger');

const defaultServerPort = 3000;
let serverUrl;
const startServer = () => getPort({ port: defaultServerPort })
  .then((port) => {
    serverUrl = server.init(port);
  });

startServer();

const checkForUpdates = updateChecker({
  autoUpdater,
  dialog: electron.dialog,
  win,
  process,
  electron,
});

const { app, ipcMain } = electron;
let appIsReady = false;

const createWindow = () => {
  win.create({
    electron, path, electronLocalshortcut, storage, checkForUpdates, serverUrl,
  });
};

app.on('ready', () => {
  appIsReady = true;
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This will override the values defined in the app’s .plist file (macOS)
if (process.platform === 'darwin') {
  const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
  app.setAboutPanelOptions({ applicationName: 'Lisk Hub', copyright });
}

app.on('activate', () => {
  // sometimes, the event is triggered before app.on('ready', ...)
  // then creating new windows will fail
  if (win.browser === null && appIsReady) {
    createWindow();
  }
});

// Set app protocol
app.setAsDefaultProtocolClient('lisk');

// Force single instance application
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (process.platform !== 'darwin') {
    win.send({ event: 'openUrl', value: argv[1] || '/' });
  }
  if (win.browser) {
    if (win.browser.isMinimized()) win.browser.restore();
    win.browser.focus();
  }
});

if (isSecondInstance) {
  app.exit();
}

// ToDo - enable this feature when it is implemented in the new design
app.on('will-finish-launching', () => {
  // Protocol handler for MacOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    win.send({ event: 'openUrl', value: url });
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


// ipcMain.on('ledgerConnected', () => {
//   console.log('ledgerConnected');
//   store.dispatch({ type: actionTypes.connectHardwareWallet });
// });

// ToDo - enable this feature when it is implemented in the new design
// ipcMain.on('set-locale', (event, locale) => {
//   const langCode = locale.substr(0, 2);
//   if (langCode) {
//     localeHandler.update({ langCode, electron, storage, event, checkForUpdates });
//   }
// });

// ipcMain.on('request-locale', () => {
//   localeHandler.send({ storage });
// });
