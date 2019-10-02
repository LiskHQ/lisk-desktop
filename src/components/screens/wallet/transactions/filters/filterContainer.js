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
      amountFrom,
      amountTo,
      message,
    } = customFilters;

    const fields = [{
      label: t('Date'),
      name: 'date',
      value: { dateFrom, dateTo },
      type: 'date-range',
    }, {
      label: t('Amount'),
      name: 'amount',
      value: { amountFrom, amountTo },
      type: 'number-range',
    }, {
      label: t('Message'),
      placeholder: t('Write message'),
      name: 'message',
      value: message,
      type: 'text',
    }];

    return (
      <FilterDropdownButton
        fields={fields}
        updateCustomFilters={updateCustomFilters}
        applyFilters={saveFilters}
        customFilters={customFilters}
      />
    );
  }
}

export default withTranslation()(FilterContainer);
