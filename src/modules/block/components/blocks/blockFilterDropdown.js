import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';

const BlockFilterDropdown = ({ t, filters, applyFilters }) => {
  const fields = [
    {
      label: t('Date'),
      name: 'date',
      type: 'date-range',
    },
    {
      label: t('Height'),
      placeholder: t('e.g. {{value}}', { value: 10169746 }),
      name: 'height',
      type: 'integer',
    },
    {
      label: t('Generator address'),
      placeholder: t('e.g. lskzmeyea4ead534jnq9dho5vsust6h9x552zqtor'),
      name: 'generatorAddress',
      type: 'text',
    },
  ];

  const props = { fields, filters, applyFilters };

  return <FilterDropdownButton {...props} />;
};

export default withTranslation()(BlockFilterDropdown);
