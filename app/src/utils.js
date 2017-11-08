export const createNewBrowserWindow = ({ width, height, BrowserWindow, path }) =>
  (new BrowserWindow({
    width: width > 2000 ? Math.floor(width * 0.5) : width - 250,
    height: height > 1000 ? Math.floor(height * 0.7) : height - 150,
    center: true,
    webPreferences: {
    // Avoid app throttling when Electron is in background
      backgroundThrottling: false,
      // Specifies a script that will be loaded before other scripts run in the page.
      preload: path.resolve(__dirname, '../src/ipc.js'),
    },
  })
  );

export const send = ({ event, value, win, eventStack }) => {
  if (win && win.webContents && win.isUILoaded) {
    win.webContents.send(event, value);
  } else {
    eventStack.push({ event, value });
  }
};

export const sendUrlToRouter = ({ url, win, eventStack }) => { send({ event: 'openUrl', value: url, win, eventStack }); };

export const sendDetectedLang = ({ locale, win, eventStack }) => { send({ event: 'detectedLocale', value: locale, win, eventStack }); };

export const menuPopup = ({ props, inputMenu, selectionMenu, win }) => {
  const { selectionText, isEditable } = props;
  if (isEditable) {
    inputMenu.popup(win);
  } else if (selectionText && selectionText.trim() !== '') {
    selectionMenu.popup(win);
  }
};

export const sendEventsFromEventStack = ({ eventStack, win }) => {
  if (eventStack.length > 0) {
    eventStack.forEach(({ event, value }) => win.webContents.send(event, value));
  }

  return [];
};

export const sendLanguage = ({ storage, win, eventStack }) => {
  storage.get('config', (error, data) => {
    if (!error) {
      sendDetectedLang({ locale: data.lang || 'en', win, eventStack });
    }
  });
};

