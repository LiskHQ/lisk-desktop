const t = (key) => key; // This is hack to get the names in common.json
// we have to call t(...) again in src/components/setting/setting.js

const languages = {
  en: {
    name: t('English'),
    common: require('../../locales/en/common.json'),
  },
  // de: {
  //   name: t('German'),
  //   common: require('../../locales/de/common.json'),
  // },
};
export default languages;
