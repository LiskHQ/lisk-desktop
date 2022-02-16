import { withTranslation } from 'react-i18next';
import React from 'react';
import moment from 'moment';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import DropdownButton from '@toolbox/dropdownButton';
import Icon from '@toolbox/icon';
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

const blackListTypes = ['4:0', '5:0', '5:1', '5:3'];

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

    if (blackListTypes.some(blackListType => blackListType === fields.moduleAssetId?.value)) {
      this.props.onTypeSelected(fields.moduleAssetId.value);
    } else {
      this.props.onTypeSelected(null);
    }
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

  extendFilters() {
    this.setState(({ areFiltersExtended }) => ({ areFiltersExtended: !areFiltersExtended }));
  }

  renderFields({
    name, label, placeholder, valueFormatter, type,
  }) {
    const Component = filterComponents[type];
    const props = {
      name, label, placeholder, valueFormatter,
    };
    return (
      <Component
        key={name}
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
        <span onClick={this.extendFilters} className={[styles.actionable, 'more-less-switch'].join(' ')}>
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
        buttonClassName="filterTransactions filter"
        buttonLabel={(
          <>
            {t('Filter')}
            <Icon className="button-icon" name="iconFilter" />
          </>
        )}
        size="l"
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        <form onSubmit={this.applyFilters} className={`${styles.form} filter-container`}>
          <div className={`${styles.container} ${areFiltersExtended && styles.extendedContainer}`}>
            {fields
              .filter((field, index) => (areFiltersExtended ? index <= 3 : index <= 2))
              .map(this.renderFields)}
            {!areFiltersExtended && this.renderFooter()}
          </div>
          {areFiltersExtended && (
          <div className={styles.container}>
              {fields.filter((field, index) => index >= 4).map(this.renderFields)}
            {this.renderFooter()}
          </div>
          )}
        </form>
      </DropdownButton>
    );
  }
}

export default withTranslation()(FilterDropdownButton);
