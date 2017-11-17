import i18n from './../i18n';

export default ({ autoUpdater, dialog }) => {
  autoUpdater.autoDownload = false;

  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 24 * 60 * 60 * 1000);

  autoUpdater.on('update-available', ({ version }) => {
    dialog.showMessageBox({
      type: 'info',
      title: i18n.t('New version available'),
      message: i18n.t('There is a new version ({{version}}) available, do you want update now?', { version }),
      buttons: [i18n.t('Update now'), i18n.t('Later')],
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      title: i18n.t('Install Updates'),
      message: i18n.t('Updates downloaded, application will be quit for update...'),
    }, () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
  });
};
