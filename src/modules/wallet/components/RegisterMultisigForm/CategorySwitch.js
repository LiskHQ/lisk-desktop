import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.css';

const CategorySwitch = ({ changeCategory, index }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.categoryWrapper} onChange={changeCategory}>
      <input
        type="radio"
        id={`mandatory-${index}`}
        name={`member-category-${index}`}
        value="mandatory"
        defaultChecked
      />
      <label
        htmlFor={`mandatory-${index}`}
        className={`mandatory select-mandatory ${styles.memberCategory} mandatory-toggle`}
      >
        {t('Mandatory')}
      </label>
      <input
        type="radio"
        id={`optional-${index}`}
        name={`member-category-${index}`}
        value="optional"
      />
      <label
        htmlFor={`optional-${index}`}
        className={`optional select-optional ${styles.memberCategory} mandatory-toggle`}
      >
        {t('Optional')}
      </label>
    </div>
  );
};

export default CategorySwitch;
