import localeHandler from './localeHandler';
import menu from './../menu';

const win = {
  browser: null,
  eventStack: [],
  init: ({ electron, path, electronLocalshortcut }) => {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const { BrowserWindow } = electron;
    win.browser = new BrowserWindow({
      width: width > 1680 ? 1680 : width,
      height: height > 1050 ? 1050 : height,
      center: true,
      webPreferences: {
        // Avoid app throttling when Electron is in background
        backgroundThrottling: false,
        // Specifies a script that will be loaded before other scripts run in the page.
        preload: path.resolve(__dirname, '../src/ipc.js'),
      },
    });

    // Enables DevTools
    win.browser.devtools = true;
    electronLocalshortcut.register(win.browser, 'CmdOrCtrl+Shift+I', () => {
      win.browser.webContents.toggleDevTools();
    });

    win.browser.loadURL(`file://${__dirname}/index.html`);
  },


  create: ({ electron, path, electronLocalshortcut, storage, checkForUpdates }) => {
    const { Menu } = electron;

    win.init({ electron, path, electronLocalshortcut });
    localeHandler.send({ storage });

    win.browser.on('blur', () => win.browser.webContents.send('blur'));
    win.browser.on('focus', () => win.browser.webContents.send('focus'));

    if (process.platform !== 'darwin') {
      win.send({ event: 'openUrl', value: process.argv[1] || '/' });
    }

    Menu.setApplicationMenu(menu.build(electron, checkForUpdates));

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

    win.browser.webContents.on('context-menu', (e, props) => {
      menuPopup({ props, selectionMenu, inputMenu }); // eslint-disable-line no-use-before-define
    });

    const handleRedirect = (e, url) => {
      if (url !== win.browser.webContents.getURL()) {
        e.preventDefault();
        electron.shell.openExternal(url);
      }
    };
    win.browser.webContents.on('will-navigate', handleRedirect);
    win.browser.webContents.on('new-window', handleRedirect);

    // Resolve all events from stack when dom is ready
    win.browser.webContents.on('did-finish-load', () => {
      win.isUILoaded = true;
      sendEventsFromEventStack(); // eslint-disable-line no-use-before-define
    });

    win.browser.on('closed', () => { win.browser = null; });
  },

  send: ({ event, value }) => {
    if (win.browser && win.browser.webContents && win.isUILoaded) {
      win.browser.webContents.send(event, value);
    } else {
      win.eventStack.push({ event, value });
    }
  },
};

const menuPopup = ({ props, inputMenu, selectionMenu }) => {
  const { selectionText, isEditable } = props;
  if (isEditable) {
    inputMenu.popup(win.browser);
  } else if (selectionText && selectionText.trim() !== '') {
    selectionMenu.popup(win.browser);
  }
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

