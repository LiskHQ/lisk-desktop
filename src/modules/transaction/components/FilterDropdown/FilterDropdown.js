import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';

const FilterDropdown = ({ t, filters, applyFilters }) => {
  const fields = [
    {
      label: t('Date range'),
      name: 'date',
      type: 'date-range',
    },
    {
      label: t('Amount range'),
      name: 'amount',
      type: 'number-range',
    },
  ];

  const props = { fields, filters, applyFilters };

  return <FilterDropdownButton {...props} />;
};

export default withTranslation()(FilterDropdown);
