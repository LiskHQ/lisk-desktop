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
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: true,
    debug: true,
  }, (err, t) => {
    t();
    // initialized and ready to go!
    console.log(i18n.t('Undo'));
    console.log(`Current language used: ${i18n.language}`);
  });

// i18n.setLocale('de');
// const currentLocale = i18n.getLocale();
// console.log(currentLocale);
export default i18n;
