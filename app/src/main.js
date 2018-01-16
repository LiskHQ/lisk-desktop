import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import electronLocalshortcut from 'electron-localshortcut'; // eslint-disable-line import/no-extraneous-dependencies
import { autoUpdater } from 'electron-updater'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import win from './modules/win';
import localeHandler from './modules/localeHandler';
import updateChecker from './modules/autoUpdater';

const checkForUpdates = updateChecker({ autoUpdater, dialog: electron.dialog, win, process });

const { app, ipcMain } = electron;

let appIsReady = false;


app.on('ready', () => {
  appIsReady = true;
  win.create({ electron, path, electronLocalshortcut, storage, checkForUpdates });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This will override the values defined in the app’s .plist file (macOS)
if (process.platform === 'darwin') {
  const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
  app.setAboutPanelOptions({ applicationName: 'Lisk Nano', copyright });
}

app.on('activate', () => {
  // sometimes, the event is triggered before app.on('ready', ...)
  // then creating new windows will fail
  if (win.browser === null && appIsReady) {
    win.create({ electron, path, electronLocalshortcut, storage, checkForUpdates });
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

ipcMain.on('set-locale', (event, locale) => {
  const langCode = locale.substr(0, 2);
  if (langCode) {
    localeHandler.update({ langCode, electron, storage, event, checkForUpdates });
  }
});

ipcMain.on('request-locale', () => {
  localeHandler.send({ storage });
});
