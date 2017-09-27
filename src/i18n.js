import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import languages from './constants/languages';

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {
    common: languages[key].common,
  };
  return accumulator;
}, {});

i18n
  .use(LngDetector)
  .init({
    fallbackLng: 'en',
    resources,
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
