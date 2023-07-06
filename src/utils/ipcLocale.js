import { IPC_SET_LOCALE, IPC_DETECT_LOCALE } from 'src/const/ipcGlobal';

export default {
  // @TODO
  // eslint-disable-next-line max-statements
  init: (i18n) => {
    const { ipc } = window;
    let localeInit = false;

    if (ipc) {
      if (!i18n.language) {
        i18n.changeLanguage('en');
      }

      ipc[IPC_DETECT_LOCALE]((_, locale) => {
        i18n.changeLanguage(locale);
        localeInit = true;
      });

      i18n.on('languageChanged', (locale) => {
        if (localeInit) {
          ipc[IPC_SET_LOCALE](locale);
        }
      });
    } else {
      const language = i18n.language || window.localStorage.getItem('lang');
      if (language) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage('en');
      }

      i18n.on('languageChanged', (locale) => {
        window.localStorage.setItem('lang', locale);
      });
    }
  },
};
