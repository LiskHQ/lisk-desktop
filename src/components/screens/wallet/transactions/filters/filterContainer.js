import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from '../../../../shared/filterDropdownButton';

class FilterContainer extends React.Component {
  render() {
    const {
      customFilters, updateCustomFilters, saveFilters, t,
    } = this.props;
    const {
      dateFrom,
      dateTo,
    } = customFilters;

    const filters = [
      {
        label: t('Date'),
        name: 'date',
        value: { dateFrom, dateTo },
        type: 'date-range',
      },
    ];

    return (
      <FilterDropdownButton
        filters={filters}
        updateCustomFilters={updateCustomFilters}
        applyFilters={saveFilters}
        customFilters={customFilters}
      />
    );
  }
}

export default withTranslation()(FilterContainer);
