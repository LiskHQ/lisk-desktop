import localeHandler from './localeHandler';
import menu from '../menu';
import process from './process';
import { IPC_OPEN_URL } from '../../../src/const/ipcGlobal';
import { WHITE_LISTED_URLS } from '../utils';

const win = {
  browser: null,
  eventStack: [],
  init: ({ electron, path, electronLocalshortcut, serverUrl }) => {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const { BrowserWindow } = electron;

    win.browser = new BrowserWindow({
      width: width > 1680 ? 1680 : width,
      height: height > 1050 ? 1050 : height,
      minHeight: 576,
      minWidth: 769,
      center: true,
      webPreferences: {
        // Avoid app throttling when Electron is in background
        backgroundThrottling: false,
        // Specifies a script that will be loaded before other scripts run in the page.
        preload: path.resolve(__dirname, '../src/ipc.js'),
        // https://www.electronjs.org/docs/latest/tutorial/security#isolation-for-untrusted-content
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Enables DevTools
    const { LISK_ENABLE_DEV_TOOL, DEBUG } = process.env();

    if (LISK_ENABLE_DEV_TOOL || DEBUG) {
      win.browser.devtools = true;
      electronLocalshortcut.register(win.browser, 'CmdOrCtrl+Shift+I', () => {
        win.browser.webContents.toggleDevTools();
      });
    }

    win.browser.loadURL(serverUrl);
  },

  // eslint-disable-next-line max-statements
  create: ({ electron, path, electronLocalshortcut, storage, checkForUpdates, serverUrl }) => {
    const { Menu } = electron;

    win.init({
      electron,
      path,
      electronLocalshortcut,
      serverUrl,
    });
    localeHandler.send({ storage });

    win.browser.on('blur', () => win.browser.webContents.send('blur'));
    win.browser.on('focus', () => win.browser.webContents.send('focus'));

    if (!process.isPlatform('darwin')) {
      win.send({ event: IPC_OPEN_URL, value: process.getArgv()[1] || '/' });
    }

    Menu.setApplicationMenu(menu.build(electron, checkForUpdates));

    menu.selectionMenu = Menu.buildFromTemplate([
      { role: 'copy' },
      { type: 'separator' },
      { role: 'selectall' },
    ]);

    menu.inputMenu = Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' },
    ]);

    win.browser.webContents.on('context-menu', (e, props) => {
      const { selectionText, isEditable } = props;
      if (isEditable) {
        menu.inputMenu.popup(win.browser);
      } else if (selectionText && selectionText.trim() !== '') {
        menu.selectionMenu.popup(win.browser);
      }
    });

    // eslint-disable-next-line max-statements
    const handleRedirect = (e, url) => {
      try {
        const urlData = new URL(url);

        const isUrlAllowed = WHITE_LISTED_URLS.some(
          ({ protocol, urlKey, domains }) =>
            protocol === urlData.protocol && domains.includes(urlData[urlKey])
        );

        if (!isUrlAllowed) return e.preventDefault();

        if (url !== win.browser.webContents.getURL()) {
          e.preventDefault();
          electron.shell.openExternal(url);
        }

        return null;
      } catch {
        e.preventDefault();
        return null;
      }
    };
    win.browser.webContents.on('will-navigate', handleRedirect);
    win.browser.webContents.on('new-window', handleRedirect);

    // Resolve all events from stack when dom is ready
    win.browser.webContents.on('did-finish-load', () => {
      win.isUILoaded = true;
      sendEventsFromEventStack(); // eslint-disable-line no-use-before-define
    });

    win.browser.on('closed', () => {
      win.browser = null;
    });
  },

  send: ({ event, value }) => {
    if (win.browser && win.browser.webContents && win.isUILoaded) {
      win.browser.webContents.send(event, value);
    } else {
      win.eventStack.push({ event, value });
    }
  },
};

const sendEventsFromEventStack = () => {
  if (win.eventStack.length > 0) {
    win.eventStack.forEach(({ event, value }) => {
      win.browser.webContents.send(event, value);
    });
  }

  win.eventStack.length = 0;
};

export default win;
