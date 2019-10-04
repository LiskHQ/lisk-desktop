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
      filters: props.filters,
    };

    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { filters } = this.props;
    if (prevProps.filters !== filters) {
      this.setState({ filters });
    }
  }

  handleFiltersChange(fields) {
    let { filters } = this.state;
    let hasErrors = false;
    filters = Object.keys(fields).reduce((acc, field) => {
      hasErrors = hasErrors || !!fields[field].error;
      return {
        ...acc,
        [field]: fields[field].value,
      };
    }, filters);

    this.setState({ filters, hasErrors });
  }

  applyFilters(event) {
    event.preventDefault();
    const { filters } = this.state;
    ['dateFrom', 'dateTo'].forEach((param) => {
      const dateFormat = this.props.t('DD.MM.YY');
      const date = moment(filters[param], dateFormat);
      filters[param] = (date.isValid() && date.format(dateFormat)) || filters[param];
    });

    this.props.applyFilters(filters);
    this.childRef.toggleDropdown();
  }

  setChildRef(node) {
    this.childRef = node;
  }

  getFilters(filter) {
    const { filters } = this.state;
    return filter.type.indexOf('range') !== -1 ? {
      [`${filter.name}From`]: filters[`${filter.name}From`],
      [`${filter.name}To`]: filters[`${filter.name}To`],
    } : {
      [filter.name]: filters[filter.name],
    };
  }

  render() {
    const { t, fields } = this.props;
    const { hasErrors } = this.state;

    return (
      <DropdownButton
        buttonClassName={`${styles.filterTransactionsButton} filterTransactions filter`}
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
          {fields.map((filter) => {
            const Component = filterComponents[filter.type];
            return (
              <Component
                key={filter.name}
                name={filter.name}
                label={filter.label}
                placeholder={filter.placeholder}
                filters={this.getFilters(filter)}
                updateCustomFilters={this.handleFiltersChange}
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
