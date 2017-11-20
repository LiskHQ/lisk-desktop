import i18n from './../i18n';

export default ({ autoUpdater, dialog, win, process }) => {
  const updater = {
    menuItem: { enabled: true },
  };
  autoUpdater.autoDownload = false;

  if (process.platform !== 'linux') {
    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 24 * 60 * 60 * 1000);
  }

  autoUpdater.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('There was a problem updating the application');
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line max-len
    if (updater.error !== error) {
      updater.error = error;
      dialog.showErrorBox('Error: ', error == null ? 'unknown' : error.toString());
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    // eslint-disable-next-line no-console
    console.log(logMessage);
    win.browser.setProgressBar(progressObj.transferred / progressObj.total);
  });

  autoUpdater.on('update-available', ({ version }) => {
    updater.error = undefined;
    dialog.showMessageBox({
      type: 'info',
      title: i18n.t('New version available'),
      message: i18n.t('There is a new version ({{version}}) available, do you want to update now?', { version }),
      buttons: [i18n.t('Update now'), i18n.t('Later')],
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
        setTimeout(() => {
          if (!updater.error) {
            dialog.showMessageBox({
              title: i18n.t('Dowload started'),
              message: i18n.t('The download was started. Depending on your internet speed it can take up to several minutes. You will be informed then it is finished and prompted to restart the app.'),
            });
          }
        }, 500);
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
      title: i18n.t('Update download finished'),
      buttons: [i18n.t('Restart now'), i18n.t('Later')],
      message: i18n.t('Updates downloaded, application has to be restarted to apply the updates.'),
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.quitAndInstall();
      }
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
