import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import Win from './Win';
import EventStack from './EventStack';

describe('Electron Browser Window Wrapper', () => {
  let electron;
  electron = {
    screen: { getPrimaryDisplay: () => ({ workAreaSize: { width: 2000, height: 1000 } }) },
    BrowserWindow: ({ width, height, center, webPreferences }) =>
      ({
        width,
        height,
        center,
        webPreferences,
        loadURL: spy(),
        on: spy(),
        webContents: {
          on: spy(),
          send: spy(),
        },
      }),
    Menu: {
      setApplicationMenu: () => {},
      buildFromTemplate: () => {},
    },
  };
  const electronLocalshortcut = {
    register: () => {},
  };
  const path = { resolve: () => ('test') };

  afterEach(() => {
    Win.browser = null;
    Win.isUILoaded = false;
    EventStack.length = 0;
  });

  describe('Init', () => {
    it('Creates the window and sets webPreferences and other settings', () => {
      Win.init({ electron, path, electronLocalshortcut });
      expect(Win.browser.webPreferences.backgroundThrottling).to.equal(false);
      expect(Win.browser.webPreferences.preload).to.equal('test');
      expect(Win.browser.center).to.equal(true);
      expect(Win.browser.devtools).to.equal(true);
      expect(Win.browser.loadURL).to.have.been.calledWith(`file://${__dirname}/index.html`);
    });

    it('Creates the window and knows how to adjust the size', () => {
      Win.init({ electron, path, electronLocalshortcut });
      expect(Win.browser.height).to.equal(850);
      expect(Win.browser.width).to.equal(1750);
    });

    it('Creates the window and knows how to adjust the size', () => {
      electron.screen.getPrimaryDisplay = () => ({ workAreaSize: { width: 2001, height: 1001 } });
      Win.init({ electron, path, electronLocalshortcut });
      expect(Win.browser.height).to.equal(700);
      expect(Win.browser.width).to.equal(1000);
    });
  });

  describe('Sending events', () => {
    it('Saves events in event stack', () => {
      expect(EventStack.length).to.equal(0);
      Win.send({ event: 'openUrl', value: 'someurl' });
      expect(Win.browser).to.equal(null);
      expect(EventStack.length).to.equal(1);
    });

    it('Sends events', () => {
      Win.init({ electron, path, electronLocalshortcut });
      Win.browser.webContents = { send: spy() };
      Win.isUILoaded = true;
      Win.send({ event: 'openUrl', value: 'someurl' });
      expect(Win.browser.webContents.send).to.have.been.calledWith('openUrl', 'someurl');
      expect(EventStack.length).to.equal(0);
    });
  });

  describe('Create', () => {
    const callbacks = {};
    let events = [];

    const storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
      },
    };

    electron = {
      screen: { getPrimaryDisplay: () => ({ workAreaSize: { width: 2000, height: 1000 } }) },
      BrowserWindow: ({ width, height, center, webPreferences }) =>
        ({
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
        buildFromTemplate: () => (electron.Menu),
        popup: spy(),
      },
      app: { getName: () => ('Lisk Nano'), getVersion: () => ('some version') },
    };

    afterEach(() => {
      events = [];
    });

    it('Creates the window with menu when platform is "darwin"', () => {
      process.platform = 'darwin';

      expect(Win.browser).to.equal(null);
      Win.create({ electron, path, electronLocalshortcut, storage });
      expect(Win.browser).to.not.equal(null);

      // detect the locale
      callbacks.config(null, { lang: 'de' });
      expect(EventStack.length).to.equal(1);
      expect(EventStack[0].event).to.equal('detectedLocale');
      expect(EventStack[0].value).to.equal('de');

      // check the menu gets build
      // todo: think of a better way to test this? don't actually execute 'buildMenu'
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);

      // todo: think of a way to differentiate between 'inputMenu' and 'selectionMenu' in the test
      callbacks['context-menu'](null, { isEditable: true });
      expect(electron.Menu.popup).to.have.been.calledWith(Win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(EventStack.length).to.equal(0);
      expect(events.length).to.equal(1);
      expect(events[0].event).to.equal('detectedLocale');
      expect(events[0].value).to.equal('de');

      callbacks.closed();
      expect(Win.browser).to.equal(null);
    });

    it('Creates the window with menu when platform is not "darwin"', () => {
      process.platform = 'not darwin';

      expect(Win.browser).to.equal(null);
      Win.create({ electron, path, electronLocalshortcut, storage });
      expect(Win.browser).to.not.equal(null);

      // detect the locale
      callbacks.config(null, { lang: 'de' });
      expect(EventStack.length).to.equal(2);
      expect(EventStack[0].event).to.equal('openUrl');
      expect(EventStack[0].value).to.equal('/');
      expect(EventStack[1].event).to.equal('detectedLocale');
      expect(EventStack[1].value).to.equal('de');

      // check the menu gets build
      // todo: think of a better way to test this? don't actually execute 'buildMenu'
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);

      // todo: think of a way to differentiate between 'inputMenu' and 'selectionMenu' in the test
      callbacks['context-menu'](null, { selectionText: 'some text' });
      expect(electron.Menu.popup).to.have.been.calledWith(Win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(EventStack.length).to.equal(0);
      expect(events.length).to.equal(2);
      expect(events[0].event).to.equal('openUrl');
      expect(events[0].value).to.equal('/');
      expect(events[1].event).to.equal('detectedLocale');
      expect(events[1].value).to.equal('de');

      callbacks.closed();
      expect(Win.browser).to.equal(null);
    });
  });
});
