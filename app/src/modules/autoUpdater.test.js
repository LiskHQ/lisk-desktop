import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import sinon, { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import autoUpdater from './autoUpdater';

describe('autoUpdater', () => {
  const event = {};
  const releaseNotes = '';
  const releaseName = '1.2.3';
  let params;
  let callbacks;
  let clock;

  beforeEach(() => {
    callbacks = {};
    params = {
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

  it('should call params.autoUpdater.checkForUpdates', () => {
    autoUpdater(params);
    expect(params.autoUpdater.checkForUpdates).to.have.been.calledWithExactly();
  });

  it('should call params.autoUpdater.checkForUpdates every 24 hours', () => {
    autoUpdater(params);
    expect(params.autoUpdater.checkForUpdates).to.have.callCount(1);
    clock.tick(24 * 60 * 60 * 1000);
    expect(params.autoUpdater.checkForUpdates).to.have.callCount(2);
    clock.tick(24 * 60 * 60 * 1000);
    expect(params.autoUpdater.checkForUpdates).to.have.callCount(3);
  });

  it('should call params.autoUpdater.on with "update-downloaded" and "error"', () => {
    autoUpdater(params);
    expect(callbacks['update-downloaded']).to.be.a('function');
    expect(callbacks.error).to.be.a('function');
  });

  it('should call params.dialog.showMessageBox on params.autoUpdater.on("update-downloaded", ...) ', () => {
    const dialogSpy = spy(params.dialog, 'showMessageBox');

    autoUpdater(params);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);

    expect(dialogSpy).to.have.been.calledWith();
  });

  it('should params.autoUpdater.quitAndInstall() in params.dialog.showMessageBox callback if the first button was pressed', () => {
    autoUpdater(params);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);
    callbacks.dialog(0);

    expect(params.autoUpdater.quitAndInstall).to.have.been.calledWithExactly();
  });

  it('should not params.autoUpdater.quitAndInstall() in params.dialog.showMessageBox callback if the second button was pressed', () => {
    autoUpdater(params);
    callbacks['update-downloaded'](event, releaseNotes, releaseName);
    callbacks.dialog(1);

    expect(params.autoUpdater.quitAndInstall).to.not.have.been.calledWith();
  });

  it('should console.error any error from params.autoUpdater.on("error", ...) ', () => {
    const error = new Error('Error: Can not find Squirrel');
    const consoleSpy = spy(console, 'error');

    autoUpdater(params);
    callbacks.error(error);

    expect(consoleSpy).to.have.been.calledWith('There was a problem updating the application');
    expect(consoleSpy).to.have.been.calledWith(error);
    consoleSpy.restore();
  });

  it('should console.log if params.autoUpdater throws error due to unsigned package', () => {
    const error = new Error('Error: Could not get code signature for running application');
    params.autoUpdater.checkForUpdates = () => {
      throw error;
    };
    const consoleSpy = spy(console, 'log');
    autoUpdater(params);

    expect(consoleSpy).to.have.been.calledWith(error);
    consoleSpy.restore();
  });
});

