import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { getModuleCommandTitle } from 'src/modules/transaction/utils/moduleCommand';
import Select from 'src/theme/Select';
import styles from './filters.css';

const SelectFilter = ({ label, placeholder, filters, name, updateCustomFilters }) => {
  // TODO: This logic is static, different blockchain application can have different commands
  // We need this logic to be dynamic based on selected chain.
  const options = Object.keys(MODULE_COMMANDS_NAME_MAP).map((key) => ({
    value: MODULE_COMMANDS_NAME_MAP[key],
    label: getModuleCommandTitle()[MODULE_COMMANDS_NAME_MAP[key]],
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
