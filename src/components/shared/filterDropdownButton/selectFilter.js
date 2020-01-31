import React from 'react';
import { withTranslation } from 'react-i18next';
import transactionTypes from '../../../constants/transactionTypes';
import styles from './filters.css';
import Select from '../../toolbox/select';

const SelectFilter = ({
  label, placeholder, filters, name, updateCustomFilters,
}) => {
  const options = [...transactionTypes.getListOf('code')];
  if (placeholder) {
    options.unshift({ value: '', label: placeholder });
  }
  const onChange = ({ value }) => {
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
