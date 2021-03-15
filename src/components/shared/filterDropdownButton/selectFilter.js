import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_ASSETS } from '@constants';
import styles from './filters.css';
import Select from '../../toolbox/select';

const SelectFilter = ({
  label, placeholder, filters, name, updateCustomFilters,
}) => {
  const txTypes = transactionTypes();
  const options = Object.keys(txTypes)
    .map(key => ({ value: txTypes[key].outgoingCode, label: txTypes[key].title }));
  options.unshift({ value: '', label: placeholder });

  const onChange = (value) => {
    updateCustomFilters({
      [name]: {
        value,
      },
    });
  };

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>
      <Select
        placeholder={placeholder}
        options={options}
        selected={filters[name]}
        onChange={onChange}
        className={styles.input}
        size="xs"
      />
    </div>
  );
};

export default withTranslation()(SelectFilter);
