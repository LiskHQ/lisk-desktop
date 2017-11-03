import i18n from 'i18next';
import languages from './languages';

const setup = () => {
  const resources = Object.keys(languages).reduce((accumulator, key) => {
    accumulator[key] = {
      common: languages[key].common,
    };
    return accumulator;
  }, {});


  return i18n
    .init({
      fallbackLng: 'en',
      resources,
      lang: 'en',
      ns: ['common'],
      defaultNS: 'common',
      saveMissing: true,
      debug: false,
      keySeparator: '>',
      nsSeparator: '|',
    });
};

export default setup;
