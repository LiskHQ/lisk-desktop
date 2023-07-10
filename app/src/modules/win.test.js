import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy, mock } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import win from './win';
import process from './process';
import menu from '../menu';
import server from '../../server';
import { IPC_DETECT_LOCALE, IPC_OPEN_URL } from '../../../src/const/ipcGlobal';

describe('Electron Browser Window Wrapper', () => {
  const callbacks = {};
  const events = [];
  const path = { resolve: () => 'test' };
  const electronLocalshortcut = {
    register: () => {},
  };

  const electron = {
    screen: { getPrimaryDisplay: () => ({ workAreaSize: { width: 1400, height: 900 } }) },
    BrowserWindow: ({ width, height, center, webPreferences }) => ({
      width,
      height,
      center,
      webPreferences,
      loadURL: spy(),
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
    Menu: {
      setApplicationMenu: spy(),
      buildFromTemplate: () => electron.Menu,
      popup: spy(),
    },
    app: { getName: () => 'Lisk', getVersion: () => 'some version' },
  };
  const url = 'http://localhost:8080/';

  let processMock;
  let serverMock;

  beforeEach(() => {
    processMock = mock(process);
    serverMock = mock(server);
    serverMock.expects('init').returns(url);
  });

  afterEach(() => {
    win.browser = null;
    win.isUILoaded = false;
    win.eventStack.length = 0;
    menu.selectionMenu = undefined;
    menu.inputMenu = undefined;
    events.length = 0;
    processMock.restore();
    serverMock.restore();
  });

  describe('Init', () => {
    it('Creates the window and sets webPreferences and other settings', () => {
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.webPreferences.backgroundThrottling).to.equal(false);
      expect(win.browser.webPreferences.preload).to.equal('test');
      expect(win.browser.center).to.equal(true);
    });

    it('Creates the window of maximum size possible size on < 1680X1050 display', () => {
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.height).to.equal(900);
      expect(win.browser.width).to.equal(1400);
    });

    it('Creates the window of maximum 1680X1050 on a bigger than that display', () => {
      electron.screen.getPrimaryDisplay = () => ({ workAreaSize: { width: 2001, height: 1051 } });
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.height).to.equal(1050);
      expect(win.browser.width).to.equal(1680);
    });
  });

  describe('Sending events', () => {
    it('Saves events in event stack', () => {
      expect(win.eventStack.length).to.equal(0);
      win.send({ event: IPC_OPEN_URL, value: 'someurl' });
      expect(win.browser).to.equal(null);
      expect(win.eventStack.length).to.equal(1);
    });

    it('Sends events', () => {
      win.init({ electron, path, electronLocalshortcut });
      win.isUILoaded = true;
      win.send({ event: IPC_OPEN_URL, value: 'someurl' });
      expect(win.eventStack.length).to.equal(0);
    });
  });

  describe('Create', () => {
    const storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
      },
    };

    it('Sends blur and focus events', () => {
      win.create({
        electron,
        path,
        electronLocalshortcut,
        storage,
      });
      expect(events.length).to.equal(0);
      callbacks.focus();
      expect(events[0].event).to.equal('focus');
      callbacks.blur();
      expect(events[1].event).to.equal('blur');
    });

    it('Creates the window with menu when platform is "darwin"', () => {
      processMock.expects('isPlatform').atLeast(2).withArgs('linux').returns(false);
      processMock.expects('isPlatform').atLeast(2).withArgs('darwin').returns(true);

      expect(win.browser).to.equal(null);
      expect(menu.selectionMenu).to.equal(undefined);
      expect(menu.inputMenu).to.equal(undefined);

      win.create({
        electron,
        path,
        electronLocalshortcut,
        storage,
      });
      expect(win.browser).to.not.equal(null);

      // detect the locale
      win.send({ event: IPC_DETECT_LOCALE, value: 'de' });
      expect(win.eventStack.length).to.equal(1);
      expect(win.eventStack[0].event).to.equal(IPC_DETECT_LOCALE);
      expect(win.eventStack[0].value).to.equal('de');

      // check the menu gets build
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);
      expect(menu.selectionMenu).to.equal(electron.Menu);
      expect(menu.inputMenu).to.equal(electron.Menu);

      callbacks['context-menu'](null, { isEditable: true });
      expect(menu.inputMenu.popup).to.have.been.calledWith(win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(win.eventStack.length).to.equal(0);
      expect(events.length).to.equal(1);
      expect(events[0].event).to.equal(IPC_DETECT_LOCALE);
      expect(events[0].value).to.equal('de');

      callbacks.closed();
      expect(win.browser).to.equal(null);
    });

    it('Creates the window with menu when platform is not "darwin"', () => {
      processMock.expects('isPlatform').atLeast(2).withArgs('darwin').returns(false);
      processMock.expects('isPlatform').atLeast(2).withArgs('linux').returns(true);
      processMock.expects('getArgv').atLeast(2).withArgs().returns([]);

      expect(win.browser).to.equal(null);
      expect(menu.selectionMenu).to.equal(undefined);
      expect(menu.inputMenu).to.equal(undefined);

      win.create({
        electron,
        path,
        electronLocalshortcut,
        storage,
      });
      expect(win.browser).to.not.equal(null);

      // detect the locale
      win.send({ event: IPC_DETECT_LOCALE, value: 'de' });
      expect(win.eventStack.length).to.equal(2);
      expect(win.eventStack[0].event).to.equal(IPC_OPEN_URL);
      expect(win.eventStack[0].value).to.equal('/');
      expect(win.eventStack[1].event).to.equal(IPC_DETECT_LOCALE);
      expect(win.eventStack[1].value).to.equal('de');

      // check the menu gets build
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);
      expect(menu.selectionMenu).to.equal(electron.Menu);
      expect(menu.inputMenu).to.equal(electron.Menu);

      callbacks['context-menu'](null, { selectionText: 'some text' });
      expect(menu.selectionMenu.popup).to.have.been.calledWith(win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(win.eventStack.length).to.equal(0);
      expect(events.length).to.equal(2);
      expect(events[0].event).to.equal(IPC_OPEN_URL);
      expect(events[0].value).to.equal('/');
      expect(events[1].event).to.equal(IPC_DETECT_LOCALE);
      expect(events[1].value).to.equal('de');

      callbacks.closed();
      expect(win.browser).to.equal(null);
    });
  });
});
