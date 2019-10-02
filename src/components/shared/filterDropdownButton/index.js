import { withTranslation } from 'react-i18next';
import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons/button';
import AmountFieldGroup from './amountFieldGroup';
import DateFieldGroup from './dateFieldGroup';
import DropdownButton from '../../toolbox/dropdownButton';
import Icon from '../../toolbox/icon';
import TextFilter from './textFilter';
import styles from './filterContainer.css';

const filterComponents = {
  'date-range': DateFieldGroup,
  'number-range': AmountFieldGroup,
  text: TextFilter,
};

class FilterDropdownButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrors: true,
    };

    this.updateCustomFilters = this.updateCustomFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
  }

  updateCustomFilters(fields) {
    const { customFilters } = this.props;
    let hasErrors = false;
    const filters = Object.keys(fields).reduce((acc, field) => {
      hasErrors = hasErrors || !!fields[field].error;
      return {
        ...acc,
        [field]: fields[field].value,
      };
    }, customFilters);

    this.props.updateCustomFilters(filters);
    this.setState({ hasErrors });
  }

  applyFilters(event) {
    event.preventDefault();
    const { customFilters } = this.props;
    ['dateFrom', 'dateTo'].forEach((param) => {
      const dateFormat = this.props.t('DD.MM.YY');
      const date = moment(customFilters[param], dateFormat);
      customFilters[param] = (date.isValid() && date.format(dateFormat)) || customFilters[param];
    });

    this.props.applyFilters(customFilters);
    this.childRef.toggleDropdown();
  }

  setChildRef(node) {
    this.childRef = node;
  }

  render() {
    const { t, filters } = this.props;
    const { hasErrors } = this.state;

    return (
      <DropdownButton
        buttonClassName={`${styles.filterTransactionsButton} filterTransactions`}
        buttonLabel={(
          <React.Fragment>
            {t('Filter')}
            <Icon className="button-icon" name="iconFilter" />
          </React.Fragment>
        )}
        size="xs"
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        <form onSubmit={this.applyFilters} className={`${styles.container} filter-container`}>
          {filters.map((filter) => {
            const Component = filterComponents[filter.type];
            return (
              <Component
                key={filter.name}
                name={filter.name}
                label={filter.label}
                placeholder={filter.placeholder}
                filters={filter.value}
                updateCustomFilters={this.updateCustomFilters}
              />
            );
          })}
          <PrimaryButton
            disabled={hasErrors}
            className={['saveButton', styles.submitButton].join(' ')}
            type="submit"
            size="s"
          >
            {t('Apply Filters')}
          </PrimaryButton>
        </form>
      </DropdownButton>
    );
  }
}

export default withTranslation()(FilterDropdownButton);
