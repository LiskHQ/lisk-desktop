import ipcLocale from './ipcLocale';

describe('ipcLocale', () => {
  const i18n = {
    changeLanguage: jest.fn(),
  };

  describe('Initializing', () => {
    beforeEach(() => {
      jest.spyOn(localStorage, 'setItem');
    });

    describe('Without ipc on window', () => {
      it('calling init when ipc is not on window does not call ipc', () => {
        ipcLocale.init(i18n);
        expect(i18n.changeLanguage).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
      });
    });
  });
});
