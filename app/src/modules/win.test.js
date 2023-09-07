/* eslint-disable max-statements */
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
  const url = 'http://localhost:8080/';

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
        getURL: () => url,
      },
    }),
    Menu: {
      setApplicationMenu: spy(),
      buildFromTemplate: () => electron.Menu,
      popup: spy(),
    },
    app: { getName: () => 'Lisk', getVersion: () => 'some version' },
    shell: {
      openExternal: spy(),
    },
  };
  const storage = {
    get: (item, callback) => {
      callbacks[item] = callback;
    },
  };

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

    it('Should validate urls on navigation to an external link', () => {
      const mockEvent = { preventDefault: spy() };
      win.create({ electron, path, electronLocalshortcut, storage });
      let mockUrl = 'https://lisk.com';

      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.have.been.calledWith(mockUrl);

      mockUrl = 'https://lisk.com/path/test';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.have.been.calledWith(mockUrl);

      mockUrl = 'mailto:desktopdev@lisk.com';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.have.been.calledWith(mockUrl);

      mockUrl =
        'mailto:desktopdev@lisk.com?&subject=User%20Reported%20Error%20-%20Lisk%20-%203.0.0-beta.2&body=%0A%20%20%20%20%0AImportant%20metadata%20for%20the%20team%2C%20please%20do%20not%20edit%3A%0A%20%20%20%20%0D%0A%20%20%20%20Chain%20Name%3A%20lisk_mainchain%2C%20Chain%20ID%3A%2002000000%2C%20Network%3A%20betanet%2C%20ServiceURL%3A%20https%3A%2F%2Fbetanet-service.lisk.com%0A%20%20%20%20%0D%0A%20%20%20%20Transaction%20Error%3A%20%22Insufficient%20transaction%20fee.%20Minimum%20required%20fee%20is%20162000.%22%0A%20%20%20%20%0D%0A%20%20%20%20Transaction%3A%20%7B%0A%20%20%22module%22%3A%20%22token%22%2C%0A%20%20%22command%22%3A%20%22transfer%22%2C%0A%20%20%22nonce%22%3A%20%2252%22%2C%0A%20%20%22fee%22%3A%20%220%22%2C%0A%20%20%22senderPublicKey%22%3A%20%223972849f2ab66376a68671c10a00e8b8b67d880434cc65b04c6ed886dfa91c2c%22%2C%0A%20%20%22params%22%3A%20%7B%0A%20%20%20%20%22tokenID%22%3A%20%220200000000000000%22%2C%0A%20%20%20%20%22amount%22%3A%20%2210000000%22%2C%0A%20%20%20%20%22recipientAddress%22%3A%20%22lsktk7bj2yadx5vq3f87gh5cwca7ptpk5djpxhhc3%22%2C%0A%20%20%20%20%22data%22%3A%20%22%22%0A%20%20%7D%2C%0A%20%20%22signatures%22%3A%20%5B%0A%20%20%20%20%22e394799864462f67531bcf9589eed1c83446ce81f20969debfccea61972771eedf6edaf5a35df7d8301c15078dd9192017af7ed8d9795ebc83451bd33cb68d0e%22%0A%20%20%5D%2C%0A%20%20%22id%22%3A%20%2220bf36776222329bb04200564990ade5a6449768b2c40a73f68749f520495375%22%0A%7D%0A%20%20%20%20%0D%0A%20%20%20%20API%20Error%20Message%3A%20An%20error%20occurred%20while%20sending%20your%20transaction%20to%20the%20network.%20Please%20try%20again.%0A%20%20';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.have.been.calledWith(mockUrl);

      mockUrl = 'mailto:mobiledev@lisk.com';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);

      mockUrl = 'smtp:mobiledev@lisk.com';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);

      mockUrl = 'http://localhost:9000';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);

      mockUrl = 'https://localhost:9000';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);

      mockUrl = 'https://www.testing.com';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);

      mockUrl = 'testing';
      callbacks['will-navigate'](mockEvent, mockUrl);
      expect(electron.shell.openExternal).to.not.have.been.calledWith(mockUrl);
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
