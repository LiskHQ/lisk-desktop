import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { getModuleCommandTitle } from '@transaction/utils/moduleAssets';
import Select from 'src/theme/Select';
import styles from './filters.css';

const SelectFilter = ({ label, placeholder, filters, name, updateCustomFilters }) => {
  const options = Object.keys(MODULE_COMMANDS_NAME_ID_MAP).map((key) => ({
    value: MODULE_COMMANDS_NAME_ID_MAP[key],
    label: getModuleCommandTitle()[MODULE_COMMANDS_NAME_ID_MAP[key]],
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
