import { Dropdown } from 'react-toolbox';
import { translate } from 'react-i18next';
import React from 'react';

import i18n from '../../i18n';
import languages from '../../../i18n/languages';

const languagesSource = Object.keys(languages).map(key => ({
  value: key,
  label: languages[key].name,
  flag: languages[key].flag,
}));

const handleChange = (value) => {
  i18n.changeLanguage(value);
};

const customItem = item => (
  <div>
    <img src={item.flag}/> {item.label}
  </div>
);

const LanguageDropdown = ({ t }) => (
  <Dropdown
    auto={false}
    className='language'
    label={t('Language')}
    source={languagesSource}
    value={i18n.language}
    template={customItem}
    onChange={handleChange}
  />
);

export default translate()(LanguageDropdown);

