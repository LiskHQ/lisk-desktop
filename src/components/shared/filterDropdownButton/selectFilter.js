import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_ASSETS } from '@constants';
import { getModuleAssetSenderLabel } from '@utils/moduleAssets';
import styles from './filters.css';
import Select from '../../toolbox/select';

const SelectFilter = ({
  label, placeholder, filters, name, updateCustomFilters,
}) => {
  const options = Object.keys(MODULE_ASSETS)
    .map(key => ({ value: MODULE_ASSETS[key], label: getModuleAssetSenderLabel()[key] }));
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
