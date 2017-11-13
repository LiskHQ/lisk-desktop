import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import Win from './Win';
import LocaleHandler from './LocaleHandler';
import EventStack from './EventStack';
import i18n from './../i18n';

describe('LocaleHandler', () => {
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
    EventStack.length = 0;
  });

  it('Changes the locale', () => {
    LocaleHandler.changeLocale({ langCode: 'de', storage });
    expect(i18n.language).to.equal('de');
    expect(options[0].lang).to.equal('de');
  });

  it('Sends the detected language', () => {
    const sendSpy = spy(Win, 'send');
    LocaleHandler.send({ storage });
    callbacks.config(null, { lang: 'de' });

    expect(sendSpy).to.have.been.calledWith({ event: 'detectedLocale', value: 'de' });
    expect(EventStack.length).to.equal(1);
    expect(EventStack[0].event).to.equal('detectedLocale');
    expect(EventStack[0].value).to.equal('de');

    sendSpy.restore();
  });

  it('Rebuilds electron menu', () => {
    const event = {};
    LocaleHandler.rebuildMenu({ electron, event });
    expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);
    expect(event.returnValue).to.equal('Rebuilt electron menu.');
  });
});
