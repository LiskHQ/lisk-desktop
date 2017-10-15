import i18n from 'i18next'; // eslint-disable-line import/no-extraneous-dependencies
import languages from './languages';

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {
    common: languages[key].common,
  };
  return accumulator;
}, {});

i18n
  .init({
    fallbackLng: 'en',
    resources,
    lang: 'en',
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: true,
    debug: false,
  }, (err, t) => {
    t('key');
    // initialized and ready to go!
    console.log(`Current language used: ${i18n.language}`); //eslint-disable-line
  });

export default i18n;
