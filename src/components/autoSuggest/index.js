import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './autoSuggest.css';
import LiskAmount from './../liskAmount';
import { FontIcon } from '../fontIcon';
import ResultsList from './resultsList';
import routes from './../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import { visitAndSaveSearch } from './../search/keyAction';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.submitSearch = this.submitSearch.bind(this);
    this.selectedRow = null;
    this.lastSearch = null;
    this.state = {
      show: false,
      value: '',
      selectedIdx: 0,
    };
    this.delegateRegEx = new RegExp(/[!@$&_.]+/g);
  }

  componentWillReceiveProps(nextProps) {
    this.selectedRow = null;
    const resultsLength = ['delegates', 'addresses', 'transactions'].reduce((total, resultKey) =>
      total + nextProps.results[resultKey].length);
    this.setState({ resultsLength });
    if (nextProps.results.delegates.length > 0
      && nextProps.results.delegates[0].username.match(this.lastSearch)) {
      this.setState({ value: nextProps.results.delegates[0].username });
    }
  }

  onResultClick(id, type) {
    let urlSearch;
    switch (type) {
      case 'addresses':
      case 'delegates':
        urlSearch = `${routes.accounts.pathPrefix}${routes.accounts.path}/${id}`;
        break;
      case 'transactions':
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
    this.setState({ value: searchTerm });
    const regEx = new RegExp(`^${searchTerm.replace(this.delegateRegEx, '')}`, 'g');
    // don't trigger search if user is just removing chars from last search
    if (searchTerm.length < 3 ||
      (this.lastSearch && this.lastSearch.match(regEx))) {
      this.setState({ show: false });
      return;
    }

    this.setState({ show: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchTerm === this.state.value) {
        this.lastSearch = searchTerm;
        this.props.searchSuggestions({
          activePeer: this.props.activePeer,
          searchTerm: this.state.value.replace(this.delegateRegEx, ''),
        });
      }
    }, 250);
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
      case keyCodes.arrowDown:
        this.handleArrowDown();
        break;
      case keyCodes.arrowUp:
        this.handleArrowUp();
        break;
      case keyCodes.escape:
        this.closeDropdown();
        break;
      case keyCodes.enter:
        visitAndSaveSearch(this.state.value, this.props.history);
        this.resetSearch();
        break;
      case keyCodes.tab:
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
    return this.props.results.delegates.map((delegate, idx) => ({
      id: delegate.address,
      valueLeft: delegate.username,
      valueRight: delegate.rank,
      isSelected: idx === this.state.selectedIdx,
      type: 'delegates',
    }));
  }

  getAddressesResults() {
    return this.props.results.addresses.map((account, idx) => ({
      id: account.address,
      valueLeft: account.address,
      valueRight: <span><LiskAmount val={account.balance}/> LSK</span>,
      isSelected: this.props.results.delegates.length + idx === this.state.selectedIdx,
      type: 'addresses',
    }));
  }

  getTransactionsResults() {
    return this.props.results.transactions.map((transaction, idx) => ({
      id: transaction.id,
      valueLeft: transaction.id,
      valueRight: transaction.height,
      isSelected: this.props.results.delegates.length +
      this.props.results.addresses.length + idx === this.state.selectedIdx,
      type: 'transactions',
    }));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t, value } = this.props;

    return (
      <div className={styles.wrapper}>
        <Input type='text' placeholder={t('Search delegates, addresses')} name='searchBarInput'
          value={this.state.value || value}
          innerRef={(el) => { this.inputRef = el; }}
          className={`${styles.input} autosuggest-input`}
          theme={styles}
          onBlur={this.closeDropdown.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off'>
          {
            this.state.value !== '' ?
              <FontIcon value='close' className={`${styles.icon} autosuggest-btn-close`} onClick={this.resetSearch.bind(this)} /> :
              <FontIcon value='search' className={`${styles.icon} ${styles.iconSearch} autosuggest-btn-search`}
                onClick={() => { visitAndSaveSearch(this.state.value, history); }} />
          }
        </Input>
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''} autosuggest-dropdown`}>
          <ResultsList
            key='delegates'
            results={this.getDelegatesResults()}
            header={{
              titleLeft: t('Delegate'),
              titleRight: t('Rank'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
          <ResultsList
            key='addresses'
            results={this.getAddressesResults()}
            header={{
              titleLeft: t('Address'),
              titleRight: t('Balance'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
          <ResultsList
            key='transactions'
            results={this.getTransactionsResults()}
            header={{
              titleLeft: t('Transaction'),
              titleRight: t('Height'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
