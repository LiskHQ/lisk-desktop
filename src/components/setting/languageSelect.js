import React from 'react';
import Select from '../toolbox/select';
import i18n from '../../i18n';
import languages from '../../../i18n/languages';
import styles from './setting.css';

export default function LanguageSelect({ t }) {
  const languageList = Object.keys(languages).map(key => ({
    value: key,
    label: t(languages[key].name),
  }));
  const activeLanguage = Math.max(0,
    languageList.map(({ value }) => value).indexOf(i18n.language));

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.labelName}>{t('Language')}</span>
      <Select
        options={languageList}
        selected={activeLanguage}
        onChange={({ value }) => i18n.changeLanguage(value)}
        className="language"
      />
    </div>
  );
}
