import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from '../../../shared/filterDropdownButton';

const FilterDropdown = ({ t, filters, applyFilters }) => {
  const fields = [
    // {
    //   label: t('Date Range'),
    //   name: 'date',
    //   type: 'date-range',
    // },
    {
      label: t('Amount Range'),
      name: 'amount',
      type: 'number-range',
    },
    {
      label: t('Message'),
      placeholder: t('Write message'),
      name: 'message',
      type: 'text',
    },
  ];

  const props = { fields, filters, applyFilters };

  return <FilterDropdownButton {...props} />;
};

export default withTranslation()(FilterDropdown);
