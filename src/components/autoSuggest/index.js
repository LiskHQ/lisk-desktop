import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './autoSuggest.css';
import LiskAmount from './../liskAmount';
import { FontIcon } from '../fontIcon';
import ResultsList from './resultsList';
import routes from './../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import { visitAndSaveSearch } from './../search/keyAction';
import mockSearchResults from './searchResults.mock';

let searchResults = mockSearchResults;
class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    this.submitSearch = this.submitSearch.bind(this);

    /* istanbul ignore next */
    searchResults = this.props.results || searchResults;

    let resultsLength = 0;
    Object.keys(searchResults).map((resultKey) => {
      resultsLength += searchResults[resultKey].length;
      return resultsLength;
    });

    this.selectedRow = null;

    this.state = {
      show: false,
      value: '',
      selectedIdx: 0,
      resultsLength,
    };
  }

  onResultClick(id, type) {
    let urlSearch;
    switch (type) {
      case 'addresses' :
      case 'delegates' :
        urlSearch = `${routes.accounts.pathPrefix}${routes.accounts.path}/${id}`;
        break;
      case 'transactions' :
        urlSearch = `${routes.transactions.pathPrefix}${routes.transactions.path}/${id}`;
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    this.submitSearch(urlSearch);
  }

  setSelectedRow(el) {
    this.selectedRow = el;
  }

  submitSearch(urlSearch) {
    this.resetSearch();
    this.inputRef.blur();
    if (!urlSearch) {
      this.selectedRow.click();
      return;
    }
    this.props.history.push(urlSearch);
  }

  search(searchTerm) {
    if (searchTerm !== '') {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
    this.setState({ value: searchTerm });
  }

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === this.resultsLength) ? this.resultsLength : currentIdx += 1;
    this.setState({ selectedIdx: currentIdx });
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === 0) ? 0 : currentIdx -= 1;
    this.setState({ selectedIdx: currentIdx });
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown :
        this.handleArrowDown();
        break;
      case keyCodes.arrowUp :
        this.handleArrowUp();
        break;
      case keyCodes.escape :
        this.closeDropdown();
        break;
      case keyCodes.enter :
        visitAndSaveSearch(this.state.value, this.props.history);
        this.resetSearch();
        break;
      case keyCodes.tab :
        this.submitSearch();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  resetSearch() {
    this.setState({ value: '' });
    this.closeDropdown();
  }

  closeDropdown() {
    this.setState({ show: false });
  }

  getDelegatesResults() {
    return searchResults.delegates.map((delegate, idx) => ({
      id: delegate.address,
      valueLeft: delegate.username,
      valueRight: delegate.rank,
      isSelected: idx === this.state.selectedIdx,
      type: 'delegates',
    }));
  }

  getAddressesResults() {
    return searchResults.addresses.map((account, idx) => ({
      id: account.address,
      valueLeft: account.address,
      valueRight: <span><LiskAmount val={account.balance}/> LSK</span>,
      isSelected: searchResults.delegates.length + idx === this.state.selectedIdx,
      type: 'addresses',
    }));
  }

  getTransactionsResults() {
    return searchResults.transactions.map((transaction, idx) => ({
      id: transaction.id,
      valueLeft: transaction.id,
      valueRight: transaction.height,
      isSelected: searchResults.delegates.length +
        searchResults.addresses.length + idx === this.state.selectedIdx,
      type: 'transactions',
    }));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t } = this.props;

    return (
      <div className={styles.wrapper}>
        <Input type='text' placeholder={t('Search delegates, addresses')} name='searchBarInput'
          value={this.state.value}
          innerRef={(el) => { this.inputRef = el; }}
          className={`${styles.input} autosuggest-input`}
          theme={styles}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off'>
          {
            this.state.show ?
              <FontIcon value='close' className={styles.icon} onClick={this.resetSearch.bind(this)} /> :
              <FontIcon value='search' className={`${styles.icon} ${styles.iconSearch}`}
                onClick={() => { visitAndSaveSearch(this.state.value, history); }} />
          }
        </Input>
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''} autosuggest-dropdown`}
          onMouseLeave={this.closeDropdown.bind(this)}>
          <ResultsList key='delegates' {...{
            results: this.getDelegatesResults(),
            header: {
              titleLeft: t('Delegate'),
              titleRight: t('Rank'),
            },
            onClick: this.onResultClick.bind(this),
            selectedRowProps: {
              ref: this.setSelectedRow.bind(this),
            },
          }} />
          <ResultsList key='addresses' {...{
            results: this.getAddressesResults(),
            header: {
              titleLeft: t('Address'),
              titleRight: t('Balance'),
            },
            onClick: this.onResultClick.bind(this),
            selectedRowProps: {
              ref: this.setSelectedRow.bind(this),
            },
          }} />
          <ResultsList key='transactions' {...{
            results: this.getTransactionsResults(),
            header: {
              titleLeft: t('Transaction'),
              titleRight: t('Height'),
            },
            onClick: this.onResultClick.bind(this),
            selectedRowProps: {
              ref: this.setSelectedRow.bind(this),
            },
          }} />
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
