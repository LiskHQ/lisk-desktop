import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import sinon, { spy, stub } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import ipcMock from 'electron-ipc-mock'; // eslint-disable-line import/no-extraneous-dependencies
import autoUpdater from './autoUpdater';
import {
  IPC_DOWNLOAD_UPDATE_COMPLETED,
  IPC_DOWNLOAD_UPDATE_PROGRESS,
  IPC_DOWNLOAD_UPDATE_START,
  IPC_UPDATE_STARTED,
  IPC_UPDATE_AVAILABLE
} from "../../../src/const/ipcGlobal";

describe('autoUpdater', () => {
  const version = '1.2.3';
  const loadURL = spy();
  const show = spy();
  const close = spy();
  const events = [];
  const { ipcMain, ipcRenderer } = ipcMock();
  let params;
  let callbacks;
  let clock;
  const electron = {
    BrowserWindow: ({ width, height, center, webPreferences }) => ({
      width,
      height,
      center,
      webPreferences,
      loadURL,
      show,
      close: () => {
        close();
        callbacks.closed();
      },
      on: (item, callback) => {
        callbacks[item] = callback;
      },
      webContents: {
        on: (item, callback) => {
          callbacks[item] = callback;
        },
        send: (event, value) => {
          events.push({ event, value });
        },
      },
    }),
    app: {
      getVersion: () => 123,
    },
    ipcMain,
  };

  beforeEach(() => {
    const quitAndInstall = spy();
    callbacks = {};
    params = {
      autoUpdater: {
        checkForUpdates: spy(),
        checkForUpdatesAndNotify: spy(),
        on: (name, callback) => {
          callbacks[name] = callback;
        },
        quitAndInstall,
        downloadUpdate: spy(),
      },
      dialog: {
        showMessageBox: () => new Promise((resolve) => resolve()),
        showErrorBox: spy(),
      },
      win: {
        send: spy(),
        browser: {
          setProgressBar: spy(),
        },
      },
    };

    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
    stub(console, 'error');
    stub(console, 'log');
  });

  afterEach(() => {
    clock.restore();
    console.error.restore(); // eslint-disable-line no-console
    console.log.restore(); // eslint-disable-line no-console
  });

  it('should call params.autoUpdater.checkForUpdates', () => {
    autoUpdater(params);
    expect(params.autoUpdater.checkForUpdatesAndNotify).to.have.been.calledWithExactly();
  });

  it('should check for updates every 24 hours', () => {
    autoUpdater(params);
    expect(params.autoUpdater.checkForUpdatesAndNotify).to.have.callCount(1);
    clock.tick(24 * 60 * 60 * 1000);
    expect(params.autoUpdater.checkForUpdatesAndNotify).to.have.callCount(2);
    clock.tick(24 * 60 * 60 * 1000);
    expect(params.autoUpdater.checkForUpdatesAndNotify).to.have.callCount(3);
  });

  it('should show error box when there was an error', () => {
    autoUpdater(params);
    callbacks.error(undefined);
    expect(params.dialog.showErrorBox).to.have.callCount(0);

    callbacks.error('404 Not Found');
    expect(params.dialog.showErrorBox).to.have.callCount(0);

    callbacks.error('error');
    expect(params.dialog.showErrorBox).to.have.callCount(1);
  });

  it('should show info box when update downloaded', () => {
    autoUpdater(params);
    callbacks['update-downloaded']({ version });

    expect(params.win.send).to.have.been.calledWith({ event: IPC_DOWNLOAD_UPDATE_COMPLETED });
  });

  it('should show info box if update was requested but not available', () => {
    const dialogSpy = spy(params.dialog, 'showMessageBox');

    const checkForUpdates = autoUpdater(params);
    checkForUpdates({});

    callbacks['update-not-available']({ version });
    expect(dialogSpy).to.have.been.calledWith({
      title: 'No updates',
      message: 'Current version is up-to-date.',
    });

    dialogSpy.resetHistory();
    callbacks['update-not-available']({ version });
    expect(dialogSpy).to.have.not.been.calledWith();
  });

  it('should Send information to renderer when update is available', () => {
    const newPrams = { ...params, electron };
    autoUpdater(newPrams);
    callbacks['update-available']({ version });
    expect(params.win.send).to.have.been.calledWith();
    ipcRenderer[IPC_UPDATE_STARTED]();
    clock.tick(1001);
    ipcRenderer.send('update', { text: 'update' });
    clock.tick(100);
    expect(params.autoUpdater.downloadUpdate).to.have.been.calledWithExactly();
    expect(params.win.send).to.have.been.calledWith({ event: IPC_DOWNLOAD_UPDATE_START });
  });

  it('should send IPC_UPDATE_AVAILABLE event when update is available', () => {
    const newPrams = { ...params, electron };
    autoUpdater(newPrams);
    callbacks['update-available']({ version });
    expect(params.win.send).to.have.been.calledWith({
      event: IPC_UPDATE_AVAILABLE,
      value: { releaseNotes: undefined, version },
    });

    expect(params.autoUpdater.downloadUpdate).to.not.have.been.calledWith();
  });

  it('should set the progress bar when being in download progress', () => {
    autoUpdater(params);
    callbacks['download-progress']({ transferred: 50, total: 100 });
    expect(params.win.send).to.have.been.calledWith({
      event: IPC_DOWNLOAD_UPDATE_PROGRESS,
      value: { transferred: 50, total: 100 },
    });
  });

  it('should not fail if browser is not defined when being in download progress', () => {
    let error;
    try {
      autoUpdater({
        ...params,
        win: {},
      });
      callbacks['download-progress']({ transferred: 50, total: 100 });
      error = false;
    } catch (e) {
      error = e;
    }
    expect(error).to.equal(false);
  });

  it('should log any update error', () => {
    const error = new Error('Error: Can not find Squirrel');

    autoUpdater(params);
    callbacks.error(error);

    // eslint-disable-next-line no-console
    expect(console.error).to.have.been.calledWith('There was a problem updating the application');
    expect(console.error).to.have.been.calledWith(error); // eslint-disable-line no-console
  });
});
