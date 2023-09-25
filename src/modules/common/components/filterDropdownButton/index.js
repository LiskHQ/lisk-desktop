import React from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import DropdownButton from 'src/theme/DropdownButton';
import Icon from 'src/theme/Icon';
import AmountFieldGroup from './amountFieldGroup';
import DateFieldGroup from './dateFieldGroup';
import IntegerFilter from './integerFilter';
import TextFilter from './textFilter';
import styles from './filterContainer.css';
import AddressFilter from './addressFilter';
import SelectFilter from './selectFilter';

const filterComponents = {
  'date-range': DateFieldGroup,
  'number-range': AmountFieldGroup,
  text: TextFilter,
  integer: IntegerFilter,
  address: AddressFilter,
  select: SelectFilter,
};

const blackListTypes = [
  'auth:registerMultisignature',
  'pos:registerValidator',
  'pos:stakeValidator',
  'pos:reportValidatorMisbehavior',
];

class FilterDropdownButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrors: true,
      filters: props.filters,
      areFiltersExtended: false,
    };

    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
    this.extendFilters = this.extendFilters.bind(this);
    this.renderFields = this.renderFields.bind(this);
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

    if (!this.props.onTypeSelected) return;

    if (blackListTypes.some((blackListType) => blackListType === fields.moduleCommand?.value)) {
      this.props.onTypeSelected(fields.moduleCommand.value);
    } else {
      this.props.onTypeSelected(null);
    }
  }

  applyFilters(event) {
    event.preventDefault();
    const { filters } = this.state;

    if (!this.props.noDateRange) {
      ['dateFrom', 'dateTo'].forEach((param) => {
        const dateFormat = this.props.t('DD.MM.YY');
        const date = moment(filters[param], dateFormat);
        filters[param] = (date.isValid() && date.format(dateFormat)) || filters[param];
      });
    }

    this.props.applyFilters(filters);
    this.childRef.toggleDropdown();
  }

  setChildRef(node) {
    this.childRef = node;
  }

  getFilters(filter) {
    const { filters } = this.state;
    return filter.type.indexOf('range') !== -1
      ? {
          [`${filter.name}From`]: filters[`${filter.name}From`],
          [`${filter.name}To`]: filters[`${filter.name}To`],
        }
      : {
          [filter.name]: filters[filter.name],
        };
  }

  extendFilters() {
    this.setState(({ areFiltersExtended }) => ({
      areFiltersExtended: !areFiltersExtended,
    }));
  }

  renderFields({ classNameDropdown, name, label, placeholder, valueFormatter, type }) {
    const Component = filterComponents[type];
    const props = {
      name,
      label,
      placeholder,
      valueFormatter,
      classNameDropdown,
    };
    return (
      <Component
        key={name}
        data-testId={name}
        showRightDropdown={type === 'date-range' && this.state.areFiltersExtended}
        {...props}
        filters={this.getFilters({ name, type })}
        updateCustomFilters={this.handleFiltersChange}
      />
    );
  }

  renderFooter() {
    const { hasErrors, areFiltersExtended } = this.state;
    const { t, fields } = this.props;

    return (
      <>
        {fields.length > 3 && (
          <span
            onClick={this.extendFilters}
            className={[styles.actionable, 'more-less-switch'].join(' ')}
          >
            {areFiltersExtended ? t('Less filters') : t('More filters')}
          </span>
        )}
        <PrimaryButton
          disabled={hasErrors}
          className={['saveButton', styles.submitButton].join(' ')}
          type="submit"
          size="s"
        >
          {t('Apply filters')}
        </PrimaryButton>
      </>
    );
  }

  render() {
    const { t, fields } = this.props;
    const { areFiltersExtended } = this.state;

    return fields.length === 0 ? null : (
      <DropdownButton
        buttonClassName={`filterTransactions filter ${styles.buttonLabel}`}
        buttonLabel={
          <>
            <Icon className="button-icon" name="iconFilter" />
            {t('Filter')}
          </>
        }
        size="l"
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        <form onSubmit={this.applyFilters} className={`${styles.form} filter-container`}>
          <div className={`${styles.container} ${areFiltersExtended && styles.extendedContainer}`}>
            {fields
              .filter((_, index) => (areFiltersExtended ? index <= 3 : index <= 2))
              .map(this.renderFields)}
            {!areFiltersExtended && this.renderFooter()}
          </div>
          {areFiltersExtended && (
            <div className={styles.container}>
              {fields.filter((_, index) => index >= 4).map(this.renderFields)}
              {this.renderFooter()}
            </div>
          )}
        </form>
      </DropdownButton>
    );
  }
}

export default withTranslation()(FilterDropdownButton);
