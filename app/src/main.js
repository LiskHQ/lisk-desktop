import { autoUpdater } from 'electron-updater';
import electron from 'electron';
import electronLocalshortcut from 'electron-localshortcut';
import getPort from 'get-port';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import path from 'path';
import { initLedgerHardwareWalletIPC } from '../../libs/hardwareWallet/ledger/initLedgerHardwareWalletIPC';
import win from './modules/win';
import localeHandler from './modules/localeHandler';
import updateChecker from './modules/autoUpdater';
import server from '../server';
import i18nSetup from '../../src/utils/i18n/i18n-setup';
import { storage, setConfig, readConfig } from './modules/storage';
import { setRendererPermissions } from './utils';
import {
  IPC_OPEN_URL,
  IPC_RETRIEVE_CONFIG,
  IPC_SET_LOCALE,
  IPC_STORE_CONFIG,
  IPC_UPDATE_QUIT_AND_INSTALL,
} from '../../src/const/ipcGlobal';

i18nSetup();

const DESKTOP_HOST = process.env.LISK_DESKTOP_HOST || '127.0.0.1';
const DESKTOP_PORT = process.env.LISK_DESKTOP_PORT || 5659;

let serverUrl;
const startServer = () =>
  getPort({ port: +DESKTOP_PORT }).then((port) => {
    serverUrl = server.init(DESKTOP_HOST, port);
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
  initLedgerHardwareWalletIPC(win);
};

const handleProtocol = () => {
  // Protocol handler for MacOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    win.browser?.show();
    win.send({ event: IPC_OPEN_URL, value: url });
  });
};

app.on('ready', () => {
  appIsReady = true;
  createWindow();
  setRendererPermissions(win);
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
const isSingleLock = app.requestSingleInstanceLock();
if (!isSingleLock) {
  app.quit();
} else {
  app.on('second-instance', (argv) => {
    if (process.platform !== 'darwin') {
      win.send({ event: IPC_OPEN_URL, value: argv[1] || '/' });
    }
    if (win.browser) {
      if (win.browser.isMinimized()) win.browser.restore();
      win.browser.focus();
    }
  });
}

app.on('will-finish-launching', () => {
  handleProtocol();
});

ipcMain.on(IPC_SET_LOCALE, (event, locale) => {
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

ipcMain.on(IPC_STORE_CONFIG, (event, data) => {
  setConfig(data);
});

ipcMain.on(IPC_RETRIEVE_CONFIG, () => {
  readConfig();
});

ipcMain.on(IPC_UPDATE_QUIT_AND_INSTALL, () => {
  autoUpdater.quitAndInstall();
});
