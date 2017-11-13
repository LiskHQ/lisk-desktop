import EventStack from './EventStack';

const win = {
  browser: null,
  init: ({ electron, path }) => {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const { BrowserWindow } = electron;
    win.browser = new BrowserWindow({
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
  },

  send: ({ event, value }) => {
    if (win.browser && win.browser.webContents && win.isUILoaded) {
      win.browser.webContents.send(event, value);
    } else {
      EventStack.push({ event, value });
    }
  },
};

export default win;

