export default {
  init: (i18n) => {
    const { ipc } = window;
    let localeInit = false;

    if (ipc) {
      ipc.on('detectedLocale', (action, locale) => {
        i18n.changeLanguage(locale);
        localeInit = true;
      });

      i18n.on('languageChanged', (locale) => {
        if (localeInit) {
          ipc.send('set-locale', locale);
        }
      });
    }
  },
};
