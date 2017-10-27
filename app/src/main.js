import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import storage from 'electron-json-storage'; // eslint-disable-line import/no-extraneous-dependencies
import i18n from './i18n';
import buildMenu from './menu';

const { app, BrowserWindow, Menu, ipcMain } = electron;

let win;
let isUILoaded = false;
let eventStack = [];
// @todo change en with the detected lang
const defaultLng = 'en';
let lang;

const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
const protocolName = 'lisk';

const sendUrlToRouter = (url) => {
  if (isUILoaded && win && win.webContents) {
    win.webContents.send('openUrl', url);
  } else {
    eventStack.push({ event: 'openUrl', value: url });
  }
};

/**
 * Sends an event to client application
 * @param {String} locale - the 2 letter name of the local
 */
const sendDetectedLang = (locale) => {
  if (isUILoaded && win && win.webContents) {
    win.webContents.send('detectedLocale', locale);
  } else {
    eventStack.push({ event: 'detectedLocale', value: locale });
  }
};

// read config data from JSON file
const getConfig = () => {
  storage.get('config', (error, data) => {
    if (error) throw error;
    lang = data.lang;
    sendDetectedLang(lang);
  });
};

getConfig();

function createWindow() {
  // set language of the react app
  if (lang) {
    sendDetectedLang(lang);
  } else {
    sendDetectedLang(defaultLng);
  }

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width > 2000 ? Math.floor(width * 0.5) : width - 250,
    height: height > 1000 ? Math.floor(height * 0.7) : height - 150,
    center: true,
    webPreferences: {
      // Avoid app throttling when Electron is in background
      backgroundThrottling: false,
      // Specifies a script that will be loaded before other scripts run in the page.
      preload: path.resolve(__dirname, '../src/ipc.js'),
    },
  });
  win.on('blur', () => win.webContents.send('blur'));
  win.on('focus', () => win.webContents.send('focus'));

  if (process.platform !== 'darwin') {
    sendUrlToRouter(process.argv[1] || '/');
  }

  Menu.setApplicationMenu(buildMenu(app, copyright, i18n));
  win.loadURL(`file://${__dirname}/index.html`);

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
  if (process.platform !== 'darwin') {
    sendUrlToRouter(argv[1] || '/');
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
    lang = langCode;
    i18n.changeLanguage(langCode);
    // write selected lang on JSON file
    storage.set('config', { lang: langCode }, (error) => {
      if (error) throw error;
    });
    Menu.setApplicationMenu(buildMenu(app, copyright, i18n));
    event.returnValue = 'Rebuilt electron menu.';
  }
});

ipcMain.on('request-locale', () => {
  getConfig();
});
