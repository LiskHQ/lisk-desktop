import i18n from './../i18n';

export default ({ autoUpdater, dialog }, app, process) => { // eslint-disable-line no-unused-vars
  try {
    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 24 * 60 * 60 * 1000);

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: [i18n.t('Restart'), i18n.t('Later')],
        title: i18n.t('New version of Lisk Nano available'),
        message: i18n.t('Version {{version}} has been downloaded. Please restart the application to apply the updates.', { version: releaseName }),
      };

      dialog.showMessageBox(dialogOpts, (pressedButtonIndex) => {
        if (pressedButtonIndex === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (message) => {
      // eslint-disable-next-line no-console
      console.error('There was a problem updating the application');
      // eslint-disable-next-line no-console
      console.error(message);
    });
  } catch (e) {
    // because autoUpdater doesn't work if the build is not signed
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
