import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';
import styles from '../TransactionMonitor/transactionsTable.css';

const FilterDropdown = ({ t, filters, applyFilters }) => {
  const fields = [
    {
      label: t('Date range'),
      name: 'date',
      type: 'date-range',
    },
    {
      label: t('Height'),
      placeholder: t('e.g. {{value}}', { value: '10180477' }),
      name: 'height',
      type: 'integer',
    },
    {
      classNameDropdown: styles.selectDropdownProp,
      label: t('Transaction type'),
      placeholder: t('All types'),
      name: 'moduleCommand',
      type: 'select',
    },
  ];

  const props = { fields, filters, applyFilters };

  return <FilterDropdownButton {...props} />;
};

export default withTranslation()(FilterDropdown);
