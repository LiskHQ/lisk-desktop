import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
// import Cache from 'i18next-localstorage-cache';

function loadLocales(url, options, callback) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const waitForLocale = require(`bundle-loader!./locales/${url}.json`);
    waitForLocale((locale) => {
      console.log('loaded', locale, '#########');
      callback(locale, { status: '200' });
    });
  } catch (e) {
    callback(null, { status: '404' });
  }
}

i18n
  .use(XHR)
  // .use(Cache)
  .init({
    backend: {
      loadPath: '{{lng}}',
      parse: data => data,
      ajax: loadLocales,
    },
    fallbackLng: 'en',
    lng: 'en',
    react: {
      // wait: true, // globally set to wait for loaded translations in translate hoc
      // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg.
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: false,

    // cache: {
    //   enabled: true,
    // },

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      },
    },
  });

export default i18n;
