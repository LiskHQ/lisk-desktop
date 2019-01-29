import React from 'react';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

import styles from './filterButton.css';

class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      filters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        message: '',
      },
    };
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  changeFilters(name, value) {
    this.setState({ filters: { ...this.state.filters, [name]: value } });
  }

  saveFilters() {
    this.props.saveFilters(this.state.filters);
    this.setState({ showFilters: false, filters: {} });
  }

  render() {
    return (
      <div>
        <div
          className={styles.filterTransactions}
          onClick={() => this.toggleFilters()}>
            Filter Transactions
        </div>
          {this.state.showFilters ?
            <div className={styles.container}>
              <div className={styles.triangleBorder}></div>
              <div className={styles.triangle}></div>
              <div className={styles.label}>Date</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-date-from'
                  name='dateFrom'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  value={this.state.filters.dateFrom}
                  onChange={(val) => { this.changeFilters('dateFrom', val); }}/>
                <div className={styles.dash}>—</div>
                <Input
                  type='text'
                  id='filter-date-to'
                  name='dateTo'
                  placeholder='MM-DD-YY'
                  theme={styles}
                  value={this.state.filters.dateTo}
                  onChange={(val) => { this.changeFilters('dateTo', val); }}/>
              </div>
              <div className={styles.label}>Amount</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-date-from'
                  name='amountFrom'
                  placeholder='Min'
                  theme={styles}
                  value={this.state.filters.amountFrom}
                  onChange={(val) => { this.changeFilters('amountFrom', val); }}/>
                <div className={styles.dash}>—</div>
                <Input
                  type='text'
                  id='filter-date-to'
                  name='amountTo'
                  placeholder='Max'
                  theme={styles}
                  value={this.state.filters.amountTo}
                  onChange={(val) => { this.changeFilters('amountTo', val); }}/>
              </div>
              <div className={styles.label}>Message</div>
              <div className={styles.row}>
                <Input
                  type='text'
                  id='filter-message'
                  name='message'
                  placeholder='Message'
                  theme={styles}
                  value={this.state.filters.message}
                  onChange={(val) => { this.changeFilters('message', val); }}/>
              </div>
              <div className={styles.buttonContainer}>
                <Button
                  tooltip='tooltip here'
                  className={styles.saveButton}
                  onClick={this.saveFilters.bind(this)}>Apply Filters</Button>
              </div>
            </div>
            : null}
      </div>);
  }
}

export default FilterButton;
