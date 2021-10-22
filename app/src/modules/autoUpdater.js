import i18n from 'i18next';

const getErrorMessage = (error) => {
  if (error.indexOf('404 Not Found') > -1 || error.indexOf('command is disabled') > -1) {
    return '';
  } if (error.indexOf('DISCONNECTED') > -1 || error.indexOf('net:') > -1) {
    return 'Please check your internet connection.';
  }
  return error || 'There was a problem updating the application';
};

export default ({ // eslint-disable-line max-statements
  autoUpdater, dialog, win, electron,
}) => {
  const updater = {
    menuItem: { enabled: true },
  };
  autoUpdater.autoDownload = false;

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('There was a problem updating the application');
    // eslint-disable-next-line no-console
    console.error(error);
    if (updater.error !== error) {
      updater.error = error;
      const message = getErrorMessage(error ? error.toString() : '');
      if (message) {
        dialog.showErrorBox(`${i18n.t('Error')}: `, message);
      }
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    // eslint-disable-next-line no-console
    console.log(logMessage);
    if (win?.browser) {
      win.browser.setProgressBar(progressObj.transferred / progressObj.total);
    }
  });

  autoUpdater.on('update-available', ({ releaseNotes, version }) => {
    updater.error = undefined;
    const { ipcMain } = electron;

    ipcMain.removeAllListeners('update:started');
    ipcMain.on('update:started', () => {
      autoUpdater.downloadUpdate();
      setTimeout(() => {
        if (!updater.error) {
          win.send({ event: 'update:downloading', value: { label: i18n.t('Download started!') } });
        }
      }, 500);
    });

    win.send({
      event: 'update:available',
      value: { releaseNotes, version },
    });
  });

  autoUpdater.on('update-not-available', () => {
    if (!updater.menuItem.enabled) {
      dialog.showMessageBox({
        title: i18n.t('No updates'),
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
    }).then((result) => {
      const buttonIndex = result?.response;
      /* istanbul ignore next */
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
