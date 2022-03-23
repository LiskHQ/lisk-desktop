import React from 'react';
import { withTranslation } from 'react-i18next';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getModuleAssetTitle } from '@common/utilities/moduleAssets';
import Select from '@basics/select';
import styles from './filters.css';

const SelectFilter = ({
  label, placeholder, filters, name, updateCustomFilters,
}) => {
  const options = Object.keys(MODULE_ASSETS_NAME_ID_MAP)
    .map(key => ({
      value: MODULE_ASSETS_NAME_ID_MAP[key],
      label: getModuleAssetTitle()[MODULE_ASSETS_NAME_ID_MAP[key]],
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
        selected={filters[name]}
        onChange={onChange}
        className={`${styles.input} transaction-options`}
        size="xs"
      />
    </div>
  );
};

export default withTranslation()(SelectFilter);
