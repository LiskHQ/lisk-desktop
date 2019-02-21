import React from 'react';
import Input from 'react-toolbox/lib/input';
import moment from 'moment';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import keyCodes from '../../../constants/keyCodes';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import DateFieldGroup from './dateFieldGroup';

import styles from './filterButton.css';
import transactionsStyles from '../transactionsV2.css';

class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      customFilters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        message: '',
      },
      errors: {
        dateFromValidity: '',
        dateToValidity: '',
        amountToValidity: '',
        amountFromValidity: '',
        messageValidity: '',
      },
    };
    this.toggleFilters = this.toggleFilters.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.validateDate = this.validateDate.bind(this);
    this.shouldDisableButton = this.shouldDisableButton.bind(this);
  }

  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    if (nextProps.customFilters.message !== this.props.customFilters.message) {
      this.setState({ customFilters: nextProps.customFilters });
    }
  }

  shouldDisableButton() {
    const { errors } = this.state;
    return !!Object.keys(errors).filter(error => errors[error] !== '').length;
  }

  validateDate(value, name) {
    const { t } = this.props;
    const { customFilters } = this.state;
    const momentFormats = ['MM-DD-YY', 'MM-DD-YYYY'];

    return (value !== '' && !moment(value, momentFormats).isValid() && t('Invalid Date'))
      || (name === 'dateFrom'
        && moment(value, momentFormats) > moment(customFilters.dateTo, momentFormats)
        && t('Must be less than end date'))
      || (name === 'dateTo'
        && moment(value, momentFormats) < moment(customFilters.dateFrom, momentFormats)
        && t('Must be greater than start date'))
      || '';
  }

  changeFilters(name, value) {
    const { t } = this.props;
    let errors = this.state.errors;
    if (name === 'dateFrom' || name === 'dateTo') {
      value = value.replace(/\D/g, '').split('').reduce((acc, digit, idx) => {
        const dashCounter = acc.split('-').length;
        return ((idx !== 0 && idx % 2 === 0) && dashCounter < 3) ? `${acc}-${digit}` : `${acc}${digit}`;
      }, '').substring(0, 10);
      const error = this.validateDate(value, name);

      errors = {
        [`${name}Validity`]: error,
      };
    }

    // if (name === 'amountTo') {
    //   errors = { amountToValidity: Number.isNaN(Number(value)) ? 'Invalid number' : '' };
    // }

    // if (name === 'amountFrom') {
    //   errors = { amountFromValidity: Number.isNaN(Number(value)) ? 'Invalid number' : '' };
    // }

    if (name === 'message') {
      const byteCount = encodeURI(value).split(/%..|./).length - 1;
      errors = { messageValidity: byteCount > 62 ? t('Maximum length exceeded') : '' };
    }

    this.setState({ customFilters: { ...this.state.customFilters, [name]: value }, errors });
  }

  saveFilters() {
    const customFilters = this.state.customFilters;
    ['dateFrom', 'dateTo'].forEach((param) => {
      const dateFormat = 'MM-DD-YYYY';
      const date = moment(customFilters[param], dateFormat);
      customFilters[param] = (date.isValid() && date.format(dateFormat)) || '';
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
        if (this.shouldDisableButton()) return false;
        this.saveFilters();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  render() {
    const message = this.state.customFilters.message;
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
              <DateFieldGroup />
              <div className={styles.label}>{this.props.t('Date')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-date-from'
                  name='dateFrom'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  error={this.state.errors.dateFromValidity}
                  value={this.state.customFilters.dateFrom}
                  onChange={(val) => { this.changeFilters('dateFrom', val); }}/>
                <span className={styles.dash}>—</span>
                <Input
                  type='text'
                  id='filter-date-to'
                  name='dateTo'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  error={this.state.errors.dateToValidity}
                  value={this.state.customFilters.dateTo}
                  onChange={(val) => { this.changeFilters('dateTo', val); }}/>
              </div>
              {/* <div className={styles.label}>{this.props.t('Amount')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-amount-from'
                  name='amountFrom'
                  placeholder='Min'
                  theme={styles}
                  value={this.state.customFilters.dateFrom}
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
                  value={this.state.customFilters.amountTo}
                  onChange={(val) => { this.changeFilters('amountTo', val); }}/>
              </div> */}
              <div className={styles.label}>{this.props.t('Message')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  className='filter-message'
                  name='message'
                  placeholder={this.props.t('Write message')}
                  theme={styles}
                  error={this.state.errors.messageValidity}
                  value={message || ''}
                  onKeyDown={this.handleKey.bind(this)}
                  onChange={(val) => { this.changeFilters('message', val); }}/>
              </div>
              <div className={styles.buttonContainer}>
                <PrimaryButtonV2
                  disabled={this.shouldDisableButton()}
                  theme={styles}
                  className='saveButton'
                  onClick={this.saveFilters.bind(this)}>{this.props.t('Apply Filters')}</PrimaryButtonV2>
              </div>
            </div>
          </DropdownV2>
        </div>
      </div>);
  }
}

export default FilterButton;
