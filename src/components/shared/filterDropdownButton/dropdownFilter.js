import React from 'react';
import { withTranslation } from 'react-i18next';
import { transactionNames } from '../../../constants/transactionTypes';
import styles from './filters.css';
import Select from '../../toolbox/select';

const DropdownFilter = ({
  label, t, placeholder, filters, name, updateCustomFilters,
}) => {
  const transactionTypes = Object.keys(transactionNames(t))
    .filter((tx, i) => i <= 4)
    .map((key, i) => ({
      value: Number(key),
      label: `${key} - ${transactionNames(t)[i]}`,
    }));

  const onChange = ({ value }) => {
    updateCustomFilters({
      [name]: {
        value,
        error: '',
        loading: false,
      },
    });
  };

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>
      <Select
        placeholder={placeholder}
        options={transactionTypes}
        selected={filters[name]}
        onChange={onChange}
        className={styles.input}
        smallSizeOptions
        size="xs"
      />
    </div>
  );
};

export default withTranslation()(DropdownFilter);
