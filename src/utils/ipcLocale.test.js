import { expect } from 'chai';
import { spy, stub } from 'sinon';
import ipcLocale from './ipcLocale';

describe('ipcLocale', () => {
  let localStorageStub;
  let callbacks;
  const ipc = {
    on: (event, callback) => { callbacks[event] = callback; },
    send: spy(),
  };

  const i18n = {
    changeLanguage: spy(),
    on: spy(),
  };

  describe('Initializing', () => {
    beforeEach(() => {
      callbacks = {};
      delete window.ipc;
      i18n.language = '';

      localStorageStub = stub(localStorage, 'getItem');
    });

    afterEach(() => {
      localStorageStub.restore();
      ipc.send.reset();
    });

    describe('Without ipc on window', () => {
      it('calling init when ipc is not on window does not call ipc', () => {
        ipcLocale.init(i18n);
        expect(Object.keys(callbacks)).to.have.length(0);
        expect(ipc.send).to.not.have.been.calledWith();
      });

      it('Saves locale in browser when there is no locale in i18n', () => {
        localStorageStub.withArgs('lang').returns('es');
        ipcLocale.init(i18n);

        expect(ipc.send).to.not.have.been.calledWith();
        expect(i18n.changeLanguage).to.have.been.calledWith('es');
      });

      it('Saves locale in browser when there is no locale in localStorage', () => {
        localStorageStub.withArgs('lang').returns('');
        i18n.language = 'de';

        ipcLocale.init(i18n);
        expect(i18n.changeLanguage).to.have.been.calledWith('de');
      });

      it('Saves locale in browser when there is no locale saved at all', () => {
        localStorageStub.withArgs('lang').returns('');
        i18n.language = 'es';

        ipcLocale.init(i18n);
        expect(i18n.changeLanguage).to.have.been.calledWith('en');
      });
    });

    describe('With ipc on window', () => {
      it('Makes a request for locale when there is no locale in i18n', () => {
        window.ipc = ipc;
        i18n.language = 'en';
        ipcLocale.init(i18n);
        expect(window.ipc.send).to.not.have.been.calledWith('request-locale');
        i18n.language = '';
        ipcLocale.init(i18n);
        expect(window.ipc.send).to.have.been.calledWith('request-locale');
      });

      it('Changes locale when detected', () => {
        window.ipc = ipc;
        ipcLocale.init(i18n);

        callbacks.detectedLocale({}, 'de');
        expect(i18n.changeLanguage).to.have.been.calledWith('de');
      });

      it('Sets language when changed', () => {
        window.ipc = ipc;
        ipcLocale.init({
          changeLanguage: spy(),
          language: 'en',
          on: (event, callback) => { callbacks[event] = callback; },
        });

        callbacks.languageChanged('de');
        expect(window.ipc.send).to.not.have.been.calledWith();

        callbacks.detectedLocale({}, 'es');
        callbacks.languageChanged('es');
        expect(window.ipc.send).to.have.been.calledWith();
      });
    });

    it('Saves locale in browser when language has changed', () => {
      localStorage.setItem = spy();
      ipcLocale.init({
        changeLanguage: spy(),
        language: 'en',
        on: (event, callback) => { callbacks[event] = callback; },
      });

      callbacks.languageChanged('de');
      expect(localStorage.setItem).to.have.been.calledWith('lang', 'de');
    });
  });
});
