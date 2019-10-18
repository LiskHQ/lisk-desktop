import React from 'react';
import { withTranslation } from 'react-i18next';
import { transactionNames } from '../../../constants/transactionTypes';
import styles from './filters.css';
import Select from '../../toolbox/select';

const SelectFilter = ({
  label, t, placeholder, filters, name, updateCustomFilters,
}) => {
  const transactionTypes = Object.keys(transactionNames(t))
    .slice(0, 5)
    .map((key, i) => ({
      value: key,
      label: `${key} - ${transactionNames(t)[i]}`,
    }));

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

export default withTranslation()(SelectFilter);
