import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from '../../../../shared/filterDropdownButton';

class FilterContainer extends React.Component {
  render() {
    const {
      customFilters, saveFilters, t,
    } = this.props;

    const fields = [{
      label: t('Date'),
      name: 'date',
      type: 'date-range',
    }, {
      label: t('Amount'),
      name: 'amount',
      type: 'number-range',
    }, {
      label: t('Message'),
      placeholder: t('Write message'),
      name: 'message',
      type: 'text',
    }];

    return (
      <FilterDropdownButton
        fields={fields}
        applyFilters={saveFilters}
        filters={customFilters}
      />
    );
  }
}

export default withTranslation()(FilterContainer);
