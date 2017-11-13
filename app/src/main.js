import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import electronLocalshortcut from 'electron-localshortcut'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import Win from './modules/Win';
import LocaleHandler from './modules/LocaleHandler';

const { app, ipcMain } = electron;

app.on('ready', () => { Win.create({ electron, path, electronLocalshortcut, storage }); });

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
  if (Win.browser === null) {
    Win.create({ electron, path, electronLocalshortcut, storage });
  }
});

// Set app protocol
app.setAsDefaultProtocolClient('lisk');

// Force single instance application
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (process.platform !== 'darwin') {
    Win.send({ event: 'openUrl', value: argv[1] || '/' });
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
    Win.send({ event: 'openUrl', value: url });
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
    LocaleHandler.update({ langCode, electron, storage, event });
  }
});

ipcMain.on('request-locale', () => {
  LocaleHandler.send({ storage });
});
