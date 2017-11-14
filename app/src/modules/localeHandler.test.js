import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import win from './win';
import localeHandler from './localeHandler';
import i18n from './../i18n';

describe('localeHandler', () => {
  const callbacks = {};
  const options = [];
  let storage;
  let electron;

  beforeEach(() => {
    storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
      },
      set: (item, option) => {
        options.push(option);
      },
    };

    electron = {
      Menu: {
        setApplicationMenu: spy(),
        buildFromTemplate: () => (electron.Menu),
      },
      app: { getName: () => ('some name'), getVersion: () => ('some version') },
    };
  });

  afterEach(() => {
    win.eventStack.length = 0;
  });

  it('Changes the locale and rebuilds the menu', () => {
    const event = {};
    localeHandler.update({ electron, event, langCode: 'de', storage });
    expect(i18n.language).to.equal('de');
    expect(options[0].lang).to.equal('de');
    expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);
    expect(event.returnValue).to.equal('Rebuilt electron menu.');
  });

  it('Sends the detected language', () => {
    const sendSpy = spy(win, 'send');
    localeHandler.send({ storage });
    callbacks.config(null, { lang: 'de' });

    expect(sendSpy).to.have.been.calledWith({ event: 'detectedLocale', value: 'de' });
    expect(win.eventStack.length).to.equal(1);
    expect(win.eventStack[0].event).to.equal('detectedLocale');
    expect(win.eventStack[0].value).to.equal('de');

    sendSpy.restore();
  });
});
