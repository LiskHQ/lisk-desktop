import i18n from './../i18n';

export default (electron, releaseNotes, updateCallBack, versions) => {
  const { BrowserWindow, ipcMain } = electron;
  let win = new BrowserWindow({
    width: 650,
    height: 550,
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
      message: `<h3>${i18n.t('Release Notes')}</h3>${releaseNotes}`,
      versions: i18n.t('Lisk Hub {{newVersion}} is available. You have {{oldVersion}}. Would you like to download it now?', versions),
      buttons: [i18n.t('Update now'), i18n.t('Later')],
    });
    win.show();
  }, 1000);

  ipcMain.removeAllListeners('update');
  ipcMain.on('update', () => {
    updateCallBack();
  });
};
