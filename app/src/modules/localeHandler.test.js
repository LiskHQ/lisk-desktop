import { expect } from 'chai';
import { spy, mock } from 'sinon';
import i18n from 'i18next';
import win from './win';
import localeHandler from './localeHandler';

describe('localeHandler', () => {
  const callbacks = {};
  const options = {};
  let storage;
  let electron;
  let i18nMock;
  const langCode = 'de';
  const event = {};

  beforeEach(() => {
    storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
        callback(options[item]);
      },
      set: (item, option) => {
        options[item] = option;
      },
    };

    electron = {
      Menu: {
        setApplicationMenu: spy(),
        buildFromTemplate: () => electron.Menu,
      },
      app: { getName: () => 'some name', getVersion: () => 'some version' },
    };
    i18nMock = mock(i18n);
  });

  afterEach(() => {
    win.eventStack.length = 0;
    i18nMock.verify();
  });

  it('Changes the locale and rebuilds the menu', () => {
    i18nMock.expects('changeLanguage').once();
    localeHandler.update({
      electron,
      event,
      langCode: 'de',
      storage,
    });
    expect(options['config.lang']).to.equal('de');
    expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);
    expect(event.returnValue).to.equal('Rebuilt electron menu.');
  });

  it.skip('Sends the detected language', () => {
    const sendSpy = spy(win, 'send');
    localeHandler.update({
      electron,
      event,
      langCode,
      storage,
    });
    localeHandler.send({ storage });

    expect(sendSpy).to.have.been.calledWith({ event: 'detectedLocale', value: 'de' });
    expect(win.eventStack.length).to.equal(1);
    expect(win.eventStack[0].event).to.equal('detectedLocale');
    expect(win.eventStack[0].value).to.equal('de');

    sendSpy.restore();
  });

  it.skip('Does not send the detected language in case of error', () => {
    const sendSpy = spy(win, 'send');
    localeHandler.send({ storage });
    callbacks.config({}, {});

    expect(sendSpy).to.not.have.been.calledWith();
    expect(win.eventStack.length).to.equal(0);

    callbacks.config(null, {});
    expect(win.eventStack.length).to.equal(1);
    expect(win.eventStack[0].event).to.equal('detectedLocale');
    expect(win.eventStack[0].value).to.equal('en');
    sendSpy.restore();
  });
});
