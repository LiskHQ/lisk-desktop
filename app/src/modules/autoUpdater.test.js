import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import sinon, { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import autoUpdater from './autoUpdater';

describe('autoUpdater', () => {
  const win = {
    getVersion() {
      return 'VERSION_NUMBER';
    },
  };
  const process = {
    platform: 'mac',
  };
  const event = {};
  const releaseNotes = '';
  const releaseName = '1.2.3';
  let electron;
  let callbacks;
  let clock;

  beforeEach(() => {
    callbacks = {};
    electron = {
      autoUpdater: {
        checkForUpdates: spy(),
        on: (name, callback) => {
          callbacks[name] = callback;
        },
        quitAndInstall: spy(),
      },
      dialog: {
        showMessageBox: (options, callback) => {
          callbacks.dialog = callback;
        },
      },
    };

    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should call electron.autoUpdater.checkForUpdates', () => {
    autoUpdater(electron, win, process);
    expect(electron.autoUpdater.checkForUpdates).to.have.been.calledWithExactly();
  });

  it('should call electron.autoUpdater.checkForUpdates every 24 hours', () => {
    autoUpdater(electron, win, process);
    expect(electron.autoUpdater.checkForUpdates).to.have.callCount(1);
    clock.tick(24 * 60 * 60 * 1000);
    expect(electron.autoUpdater.checkForUpdates).to.have.callCount(2);
    clock.tick(24 * 60 * 60 * 1000);
    expect(electron.autoUpdater.checkForUpdates).to.have.callCount(3);
  });

  it('should call electron.autoUpdater.on with "update-downloaded" and "error"', () => {
    autoUpdater(electron, win, process);
    expect(callbacks['update-downloaded']).to.be.a('function');
    expect(callbacks.error).to.be.a('function');
  });

  it('should call electron.dialog.showMessageBox on electron.autoUpdater.on("update-downloaded", ...) ', () => {
    const dialogSpy = spy(electron.dialog, 'showMessageBox');

    autoUpdater(electron, win, process);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);

    expect(dialogSpy).to.have.been.calledWith();
  });

  it('should electron.autoUpdater.quitAndInstall() in electron.dialog.showMessageBox callback if the first button was pressed', () => {
    autoUpdater(electron, win, process);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);
    callbacks.dialog(0);

    expect(electron.autoUpdater.quitAndInstall).to.have.been.calledWithExactly();
  });

  it('should not electron.autoUpdater.quitAndInstall() in electron.dialog.showMessageBox callback if the second button was pressed', () => {
    autoUpdater(electron, win, process);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);
    callbacks.dialog(1);

    expect(electron.autoUpdater.quitAndInstall).to.not.have.been.calledWith();
  });

  it('should console.error any error from electron.autoUpdater.on("error", ...) ', () => {
    const error = new Error('Error: Can not find Squirrel');
    const consoleSpy = spy(console, 'error');

    autoUpdater(electron, win, process);
    callbacks.error(error);

    expect(consoleSpy).to.have.been.calledWith('There was a problem updating the application');
    expect(consoleSpy).to.have.been.calledWith(error);
    consoleSpy.restore();
  });

  it('should console.log if electron.autoUpdater throws error due to unsigned package', () => {
    const error = new Error('Error: Could not get code signature for running application');
    electron.autoUpdater.checkForUpdates = () => {
      throw error;
    };
    const consoleSpy = spy(console, 'log');
    autoUpdater(electron, win, process);

    expect(consoleSpy).to.have.been.calledWith(error);
    consoleSpy.restore();
  });
});

