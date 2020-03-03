/**
 * Since we have planned to maintain only the English locale
 * I remove the i18n logic to detect the system default language
 * and related communication with React.
 * We can find the previous code from v1.24.0 tag.
 */
export default {
  init: (i18n) => { // eslint-disable-line max-statements
    i18n.changeLanguage('en');
    window.localStorage.setItem('lang', 'en');
  },
};
