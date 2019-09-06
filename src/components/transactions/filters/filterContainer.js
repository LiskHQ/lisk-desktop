import React from 'react';
import { translate } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import keyCodes from '../../../constants/keyCodes';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons/button';
import DateFieldGroup from './dateFieldGroup';
import MessageFieldGroup from './messageFieldGroup';
import styles from './filterContainer.css';
import AmountFieldGroup from './amountFieldGroup';
import Icon from '../../toolbox/icon';
import DropdownButton from '../../toolbox/dropdownButton';

class filterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      hasErrors: true,
    };

    this.handleKey = this.handleKey.bind(this);
    this.updateCustomFilters = this.updateCustomFilters.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
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

  saveFilters() {
    const { customFilters } = this.props;
    ['dateFrom', 'dateTo'].forEach((param) => {
      const dateFormat = this.props.t('DD.MM.YY');
      const date = moment(customFilters[param], dateFormat);
      customFilters[param] = (date.isValid() && date.format(dateFormat)) || customFilters[param];
    });

    this.props.saveFilters(customFilters);
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.enter:
        if (this.state.hasErrors) return false;
        this.saveFilters();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
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
        buttonClassName={`${styles.filterTransactions} filterTransactions extra-small`}
        className={`${styles.bookmarkDropdown}`}
        buttonLabel={(
          <span>
            {t('Filter Transactions')}
            <Icon className="button-icon" name="iconFilter" />
          </span>
        )}
        ButtonComponent={SecondaryButton}
      >
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.container} filter-container`}
            ref={(node) => { this.dropdownRef = node; }}
          >
            <DateFieldGroup
              filters={{ dateFrom, dateTo }}
              updateCustomFilters={this.updateCustomFilters}
              handleKeyPress={this.handleKey}
            />
            <AmountFieldGroup
              filters={{ amountFrom, amountTo }}
              updateCustomFilters={this.updateCustomFilters}
              handleKeyPress={this.handleKey}
            />
            <MessageFieldGroup
              filters={{ message }}
              updateCustomFilters={this.updateCustomFilters}
              handleKeyPress={this.handleKey}
            />
            <PrimaryButton
              disabled={this.state.hasErrors}
              className="saveButton small"
              onClick={this.saveFilters}
            >
              {this.props.t('Apply Filters')}
            </PrimaryButton>
          </div>
        </div>
      </DropdownButton>
    );
  }
}

export default translate()(filterContainer);
