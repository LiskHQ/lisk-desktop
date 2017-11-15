import i18n from './../i18n';

export default (electron, app, process) => {
  try {
    const feedUrl = `https://nuts.lisk.io/update/${process.platform}/${app.getVersion()}`;
    electron.autoUpdater.setFeedURL(feedUrl);

    electron.autoUpdater.checkForUpdates();
    setInterval(() => {
      electron.autoUpdater.checkForUpdates();
    }, 24 * 60 * 60 * 1000);

    electron.autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: [i18n.t('Restart'), i18n.t('Later')],
        title: i18n.t('New version of Lisk Nano available'),
        message: i18n.t('Version {{version}} has been downloaded. Please restart the application to apply the updates.', { version: releaseName }),
      };

      electron.dialog.showMessageBox(dialogOpts, (pressedButtonIndex) => {
        if (pressedButtonIndex === 0) {
          electron.autoUpdater.quitAndInstall();
        }
      });
    });

    electron.autoUpdater.on('error', (message) => {
      console.error('There was a problem updating the application');
      console.error(message);
    });
  } catch (e) {
  // because electron.autoUpdater doesn't work if the build is not signed
    console.log(e);
  }
};
