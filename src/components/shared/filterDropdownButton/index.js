import { withTranslation } from 'react-i18next';
import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons/button';
import AmountFieldGroup from './amountFieldGroup';
import DateFieldGroup from './dateFieldGroup';
import DropdownButton from '../../toolbox/dropdownButton';
import Icon from '../../toolbox/icon';
import MessageFieldGroup from './messageFieldGroup';
import styles from './filterContainer.css';

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
      hasErrors = hasErrors || fields[field].error;
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
    const { t, customFilters } = this.props;
    const {
      dateFrom,
      dateTo,
      amountFrom,
      amountTo,
      message,
    } = customFilters;

    return (
      <DropdownButton
        buttonClassName={`${styles.filterTransactionsButton} filterTransactions`}
        buttonLabel={(
          <React.Fragment>
            {t('Filter Transactions')}
            <Icon className="button-icon" name="iconFilter" />
          </React.Fragment>
        )}
        size="xs"
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        <form onSubmit={this.applyFilters}>
          <div
            className={`${styles.container} filter-container`}
          >
            <DateFieldGroup
              filters={{ dateFrom, dateTo }}
              updateCustomFilters={this.updateCustomFilters}
            />
            <AmountFieldGroup
              filters={{ amountFrom, amountTo }}
              updateCustomFilters={this.updateCustomFilters}
            />
            <MessageFieldGroup
              filters={{ message }}
              updateCustomFilters={this.updateCustomFilters}
            />
            <PrimaryButton
              disabled={this.state.hasErrors}
              className="saveButton small"
              type="submit"
            >
              {this.props.t('Apply Filters')}
            </PrimaryButton>
          </div>
        </form>
      </DropdownButton>
    );
  }
}

export default withTranslation()(FilterDropdownButton);
