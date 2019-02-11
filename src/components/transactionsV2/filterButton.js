import React from 'react';
import Input from 'react-toolbox/lib/input';
import { FontIcon } from '../fontIcon';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import keyCodes from './../../constants/keyCodes';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';

import styles from './filterButton.css';
import transactionsStyles from './transactionsV2.css';

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
      amountToValidity: '',
      amountFromValidity: '',
    };
    this.toggleFilters = this.toggleFilters.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    if (nextProps.customFilters.message !== this.props.customFilters.message) {
      this.setState({ customFilters: nextProps.customFilters });
    }
  }

  changeFilters(name, value) {
    // let errors = {};
    // if (name === 'amountTo') {
    //   errors = { amountToValidity: Number.isNaN(Number(value)) ? 'Invalid number' : '' };
    // }

    // if (name === 'amountFrom') {
    //   errors = { amountFromValidity: Number.isNaN(Number(value)) ? 'Invalid number' : '' };
    // }
    this.setState({ customFilters: { ...this.state.customFilters, [name]: value } });
    // this.setState({ customFilters: { ...this.state.customFilters, [name]: value }, ...errors });
  }

  saveFilters() {
    const customFilters = this.state.customFilters;
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
        this.saveFilters();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  render() {
    const message = this.state.customFilters.message || this.props.customFilters.message;

    return (
      <div className={`${transactionsStyles.filters} ${transactionsStyles.item}`}>
        <div
          className={`${styles.filterTransactions} filterTransactions`}
          onClick={() => { this.toggleFilters(); }}>
            {this.props.t('Filter Transactions')}
            <FontIcon className={styles.triangleDown} value='arrow-down'/>
        </div>
        <div className={styles.dropdownContainer}>
          <DropdownV2 className={styles.bigDropdown} showDropdown={this.state.showFilters}>
            <div
              className={`${styles.container} container`}
              ref={(node) => { this.dropdownRef = node; }}>
              {/* <div className={styles.triangleBorder}></div>
              <div className={styles.triangle}></div> */}
              {/* <div className={styles.label}>{this.props.t('Date')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-date-from'
                  name='dateFrom'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  value={this.state.customFilters.dateFrom}
                  onChange={(val) => { this.changeFilters('dateFrom', val); }}/>
                TODO <DatePicker
                  dateFormat="MM-dd-yy"
                  placeholderText="MM-DD-YY"
                  selected={this.state.filters.dateFrom}
                  onChange={(val) => { this.changeFilters('dateFrom', val); }}
                />
                <div className={styles.dash}>—</div>
                <Input
                  type='text'
                  id='filter-date-to'
                  name='dateTo'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  value={this.state.customFilters.dateTo}
                  onChange={(val) => { this.changeFilters('dateTo', val); }}/>
              </div>
              <div className={styles.label}>{this.props.t('Amount')}</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-amount-from'
                  name='amountFrom'
                  placeholder='Min'
                  theme={styles}
                  value={this.state.customFilters.dateFrom}
                  error={this.state.amountFromValidity}
                  onChange={(val) => { this.changeFilters('amountFrom', val); }}/>
                <div className={styles.dash}>—</div>
                <Input
                  type='text'
                  id='filter-amount-to'
                  name='amountTo'
                  placeholder='Max'
                  error={this.state.amountToValidity}
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
                  value={message || ''}
                  onKeyDown={this.handleKey.bind(this)}
                  onChange={(val) => { this.changeFilters('message', val); }}/>
              </div>
              <div className={styles.buttonContainer}>
                <PrimaryButtonV2
                  className={`${styles.saveButton} saveButton`}
                  onClick={this.saveFilters.bind(this)}>{this.props.t('Apply Filters')}</PrimaryButtonV2>
              </div>
            </div>
          </DropdownV2>
        </div>
      </div>);
  }
}

export default FilterButton;
