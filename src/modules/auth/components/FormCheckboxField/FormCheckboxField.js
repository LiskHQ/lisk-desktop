import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CheckBox from 'src/theme/CheckBox';
import setPasswordFormContext from '../../context/setPasswordFormContext';
import styles from './FormCheckboxField.css';

function FormInputTextField({ name, label, validation }) {
  const { register } = useContext(setPasswordFormContext);
  const { t } = useTranslation();

  return (
    <div className={`${styles.wrapper}`}>
      <CheckBox
        className={`${styles.checkbox}`}
        {...register(name, validation)}
      />
      <span>{t(label)}</span>
    </div>
  );
}

export default FormInputTextField;
