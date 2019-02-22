import React from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import keyCodes from '../../../constants/keyCodes';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import DateFieldGroup from './dateFieldGroup';
import MessageFieldGroup from './messageFieldGroup';

import styles from './filterContainer.css';
import transactionsStyles from '../transactionsV2.css';

class filterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      hasErrors: false,
    };

    this.toggleFilters = this.toggleFilters.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
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

    this.toggleFilters();

    this.props.saveFilters(customFilters);
  }

  toggleFilters() {
    if (!this.state.showFilters) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }

    this.setState(prevState => ({ showFilters: !prevState.showFilters }));
  }

  // istanbul ignore next
  handleClickOutside(e) {
    if (this.dropdownRef && this.dropdownRef.contains(e.target) && this.state.showFilters) return;
    this.toggleFilters();
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
    const { t } = this.props;

    return (
      <div className={`${transactionsStyles.item}`}>
        <div
          className={`${styles.filterTransactions} filterTransactions`}
          onClick={this.toggleFilters}>
            {t('Filter Transactions')}
        </div>
        <div className={styles.dropdownContainer}>
          <DropdownV2 className={styles.bigDropdown} showDropdown={this.state.showFilters}>
            <div
              className={`${styles.container} container`}
              ref={(node) => { this.dropdownRef = node; }}>
              <DateFieldGroup
                filters={this.props.customFilters}
                updateCustomFilters={this.updateCustomFilters}
                handleKeyPress={this.handleKey} />
              <MessageFieldGroup
                filters={this.props.customFilters}
                updateCustomFilters={this.updateCustomFilters}
                handleKeyPress={this.handleKey} />
              {/* <div className={styles.label}>{this.props.t('Amount')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-amount-from'
                  name='amountFrom'
                  placeholder='Min'
                  theme={styles}
                  value={this.props.customFilters.dateFrom}
                  error={this.state.errors.amountFromValidity}
                  onChange={(val) => { this.changeFilters('amountFrom', val); }}/>
                <div className={styles.dash}>—</div>
                <Input
                  type='text'
                  id='filter-amount-to'
                  name='amountTo'
                  placeholder='Max'
                  error={this.state.errors.amountToValidity}
                  theme={styles}
                  value={this.props.customFilters.amountTo}
                  onChange={(val) => { this.changeFilters('amountTo', val); }}/>
              </div> */}
              <div className={styles.buttonContainer}>
                <PrimaryButtonV2
                  disabled={this.state.hasErrors}
                  theme={styles}
                  className='saveButton'
                  onClick={this.saveFilters}>{this.props.t('Apply Filters')}</PrimaryButtonV2>
              </div>
            </div>
          </DropdownV2>
        </div>
      </div>);
  }
}

export default translate()(filterContainer);
