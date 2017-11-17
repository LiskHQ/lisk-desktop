import i18n from './../i18n';

export default ({ autoUpdater, dialog }) => {
  const updater = {
    menuItem: { enabled: true },
  };
  autoUpdater.autoDownload = false;

  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 24 * 60 * 60 * 1000);

  autoUpdater.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('There was a problem updating the application');
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line max-len
    // dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    // eslint-disable-next-line no-console
    console.log(logMessage);
  });

  autoUpdater.on('update-available', ({ version }) => {
    dialog.showMessageBox({
      type: 'info',
      title: i18n.t('New version available'),
      message: i18n.t('There is a new version ({{version}}) available, do you want update now?', { version }),
      buttons: [i18n.t('Update now'), i18n.t('Later')],
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        updater.menuItem.enabled = true;
      }
    });
  });

  autoUpdater.on('update-not-available', () => {
    if (!updater.menuItem.enabled) {
      dialog.showMessageBox({
        title: i18n.t('No Updates'),
        message: i18n.t('Current version is up-to-date.'),
      });
    }
    updater.menuItem.enabled = true;
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      title: i18n.t('Install Updates'),
      message: i18n.t('Updates downloaded, application will be quit for update...'),
    }, () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
  });

  // export this to MenuItem click callback
  function checkForUpdates(menuItem) {
    autoUpdater.checkForUpdates();
    updater.menuItem = menuItem;
    updater.menuItem.enabled = false;
  }

  return checkForUpdates;
};
