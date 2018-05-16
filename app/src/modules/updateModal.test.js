import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import ipcMock from 'electron-ipc-mock'; // eslint-disable-line import/no-extraneous-dependencies
import updateModal from './updateModal';

describe('Electron update modal', () => {
  const updateCallBack = spy();
  const loadURL = spy();
  const show = spy();
  const callbacks = {};
  const events = [];
  const { ipcMain, ipcRenderer } = ipcMock();
  let clock;
  const electron = {
    BrowserWindow: ({ width, height, center, webPreferences }) =>
      ({
        width,
        height,
        center,
        webPreferences,
        loadURL,
        show,
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
          getURL: () => 'url',
        },
      }),
    ipcMain,
    shell: {
      openExternal: spy(),
    },
  };
  const versions = {
    oldVersion: 0,
    newVersion: 1,
  };

  beforeEach(() => {
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });
  it('show create a window', () => {
    updateModal(electron, 'test notes', updateCallBack, versions);
    expect(loadURL).to.has.been.calledWith();
    clock.tick(1001);
    expect(show).to.has.been.calledWith();
  });
  it('show close the window when "update" event is fired', () => {
    updateModal(electron, 'test notes', updateCallBack, versions);
    ipcRenderer.send('update', { text: 'update' });
    clock.tick(100);
    expect(updateCallBack).to.has.been.calledWith();
  });
  it('trigger "will-navigate" shouldn\'t fire "shell.openExternal" on electron when url isn\'t equal getURL', () => {
    updateModal(electron, 'test notes', updateCallBack, versions);
    callbacks['will-navigate']({ preventDefault: () => true }, 'url');
    clock.tick(100);
    expect(electron.shell.openExternal).to.not.has.been.calledWith();
  });
  it('trigger "will-navigate" should fire "shell.openExternal" on electron when url isn\'t equal getURL', () => {
    updateModal(electron, 'test notes', updateCallBack, versions);
    callbacks['will-navigate']({ preventDefault: () => true }, 'www');
    clock.tick(100);
    expect(electron.shell.openExternal).to.has.been.calledWith('www');
  });
});
