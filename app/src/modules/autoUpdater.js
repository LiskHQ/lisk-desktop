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
  // TODO remove this mock
  const versionMock = '2.5.0';
  const releaseNotesMock = `<h4>asfsabjhskdnsadksadnkasdnsajdsakjdaj</h4>
      <p>injklmklmlk 2132143454354</p>
      <ul>
      <li>123213</li>
      <li>dsfds3213</li>
      <li>oiouytre 23
      <p>injklmklmlk 2132143454354</p>
      <p>rewr rewrew wrwec cdsfd ewref fdsfsd</p>
      </li>
      </ul>
      <p>rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd</p>
      <p>rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd rewr rewrew wrwec cdsfd ewref fdsfsd</p>
      `;
  win.send({
    event: 'update:available',
    value: { releaseNotes: releaseNotesMock, version: versionMock },
  });
  //

  const updater = {
    menuItem: { enabled: true },
  };
  autoUpdater.autoDownload = false;

  autoUpdater.checkForUpdatesAndNotify();
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 24 * 60 * 60 * 1000);

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
    if (win?.send) {
      win.send({ event: 'downloadUpdateProgress', value: progressObj });
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
          win.send({ event: 'downloadUpdateStart' });
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
    win.send({ event: 'downloadUpdateCompleted' });
  });

  // export this to MenuItem click callback
  function checkForUpdates(menuItem) {
    autoUpdater.checkForUpdates();
    updater.menuItem = menuItem;
    updater.menuItem.enabled = false;
  }

  return checkForUpdates;
};
