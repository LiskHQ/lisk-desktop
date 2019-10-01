import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from '../../../../shared/filterDropdownButton';

class FilterContainer extends React.Component {
  render() {
    const { customFilters, updateCustomFilters, saveFilters } = this.props;

    return (
      <FilterDropdownButton
        updateCustomFilters={updateCustomFilters}
        saveFilters={saveFilters}
        customFilters={customFilters}
      />
    );
  }
}

export default withTranslation()(FilterContainer);
