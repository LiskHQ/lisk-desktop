import { autoUpdater } from 'electron-updater';
import electron from 'electron';
import electronLocalshortcut from 'electron-localshortcut';
import getPort from 'get-port';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import path from 'path';
import win from './modules/win';
import localeHandler from './modules/localeHandler';
import updateChecker from './modules/autoUpdater';
import server from '../server';
import i18nSetup from '../../src/utils/i18n/i18n-setup';
import { storage, setConfig, readConfig } from './modules/storage';
import { hwS } from './modules/hwManager';

hwS.listening();
i18nSetup();

const defaultServerPort = 5659;
let serverUrl;
const startServer = () =>
  getPort({ port: defaultServerPort }).then((port) => {
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
    electron,
    path,
    electronLocalshortcut,
    storage,
    checkForUpdates,
    serverUrl,
  });

  if (process.env.DEBUG) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
      // eslint-disable-next-line no-console
      .then((name) => console.info(`Added Extension:  ${name}`))
      // eslint-disable-next-line no-console
      .catch((err) => console.info('An error occurred: ', err));
  }
};

const handleProtocol = () => {
  // Protocol handler for MacOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    win.browser?.show();
    win.send({ event: 'openUrl', value: url });
  });
};

app.on('ready', () => {
  appIsReady = true;
  createWindow();
  if (process.platform === 'win32') {
    app.setAppUserModelId('io.lisk.hub');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This will override the values defined in the app’s .plist file (macOS)
if (process.platform === 'darwin') {
  const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
  app.setAboutPanelOptions({ applicationName: 'Lisk', copyright });
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
app.requestSingleInstanceLock();
app.on('second-instance', (argv) => {
  if (process.platform !== 'darwin') {
    win.send({ event: 'openUrl', value: argv[1] || '/' });
  }
  if (win.browser) {
    if (win.browser.isMinimized()) win.browser.restore();
    win.browser.focus();
  }
});

app.on('will-finish-launching', () => {
  handleProtocol();
});

ipcMain.on('set-locale', (event, locale) => {
  const langCode = locale.substr(0, 2);
  if (langCode) {
    localeHandler.update({
      langCode,
      electron,
      storage,
      event,
      checkForUpdates,
    });
  }
});

ipcMain.on('request-locale', () => {
  localeHandler.send({ storage });
});

ipcMain.on('storeConfig', (event, data) => {
  setConfig(data);
});

ipcMain.on('retrieveConfig', () => {
  readConfig();
});

ipcMain.on('updateQuitAndInstall', () => {
  autoUpdater.quitAndInstall();
});
