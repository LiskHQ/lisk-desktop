import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
// import Cache from 'i18next-localstorage-cache';

i18n
  .use(XHR)
  // .use(Cache)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    react: {
      // wait: true, // globally set to wait for loaded translations in translate hoc
      // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg.
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    keySeparator: '>',
    nsSeparator: '|',

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
