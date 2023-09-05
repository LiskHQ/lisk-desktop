import React from 'react';
import { withTranslation } from 'react-i18next';
import { getModuleCommandTitle } from 'src/modules/transaction/utils/moduleCommand';
import Select from 'src/theme/Select';
import { useCommandSchema } from '@network/hooks';
import styles from './filters.css';

const SelectFilter = ({ label, placeholder, filters, name, updateCustomFilters }) => {
  const { moduleCommandSchemas, isLoading } = useCommandSchema();

  if (isLoading) return null;

  const options = Object.keys(moduleCommandSchemas).map((key) => ({
    value: key,
    label: getModuleCommandTitle()[key],
  }));

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
        selected={filters[name] || ''}
        onChange={onChange}
        className={`${styles.input} transaction-options`}
        size="xs"
      />
    </div>
  );
};

export default withTranslation()(SelectFilter);
