import { autoUpdater, dialog } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import i18n from './i18n';

export default (app, win) => {
  try {
    const feedUrl = `https://nuts.lisk.io/update/${process.platform}/${app.getVersion()}`;
    autoUpdater.setFeedURL(feedUrl);

    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 24 * 60 * 60 * 1000);

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
      const index = dialog.showMessageBox(win, {
        type: 'info',
        buttons: [i18n.t('Restart'), i18n.t('Later')],
        title: i18n.t('Lisk Nano'),
        message: i18n.t('The new version has been downloaded. Please restart the application to apply the updates.'),
        detail: `${releaseName}\n\n${releaseNotes}`,
      });

      if (index === 1) {
        return;
      }

      quitAndUpdate();
    });

    autoUpdater.on('error', (message) => {
      console.error('There was a problem updating the application');
      console.error(message);
    });
  } catch (e) {
  // because autoUpdater doesn't work if the build is not signed
    console.log(e);
  }
};
