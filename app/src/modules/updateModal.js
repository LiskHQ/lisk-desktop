import i18n from './../i18n';

export default (electron, releaseNotes, updateCallBack) => {
  const { BrowserWindow, ipcMain } = electron;
  let win = new BrowserWindow({
    width: 600,
    height: 500,
    modal: true,
    show: false,
    resizable: false,
  });
  win.on('closed', () => { win = null; });
  win.loadURL(`file://${__dirname}/update.html`);
  const handleRedirect = (e, url) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault();
      electron.shell.openExternal(url);
    }
  };
  win.webContents.on('will-navigate', handleRedirect);
  win.webContents.on('new-window', handleRedirect);
  // wind.webContents.toggleDevTools();
  setTimeout(() => {
    win.webContents.send('loadNotes', {
      title: i18n.t('New version available'),
      message: releaseNotes,
      buttons: [i18n.t('Update now'), i18n.t('Later')],
    });
    win.show();
  }, 1000);
  ipcMain.on('update', (e, text) => {
    console.log(text);
    win.close();
    updateCallBack();
  });
};
