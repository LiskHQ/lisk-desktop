export default {
  init: (i18n) => { // eslint-disable-line max-statements
    const { ipc } = window;
    let localeInit = false;

    if (ipc) {
      if (!i18n.language) {
        i18n.changeLanguage('en');
      }

      ipc.on('detectedLocale', (action, locale) => {
        i18n.changeLanguage(locale);
        localeInit = true;
      });

      i18n.on('languageChanged', (locale) => {
        if (localeInit) {
          ipc.send('set-locale', locale);
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
