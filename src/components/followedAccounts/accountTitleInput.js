import React from 'react';
import { translate } from 'react-i18next';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import styles from './followedAccounts.css';

const AccountTitleInput = ({
  t, title, onChange, className, disabled, hideLabel,
}) => {
  const validateInput = value => (value.length > 20 ? t('Title too long') : undefined);

  return <ToolBoxInput
    label={hideLabel ? null : t('Title')}
    className={`${styles.titleInput} ${className} account-title `}
    error={title.error}
    value={title.value}
    autoFocus={true}
    disabled={disabled}
    onChange={val => onChange(val, validateInput)}
  />;
};

export default translate()(AccountTitleInput);
