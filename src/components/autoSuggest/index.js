import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './autoSuggest.css';
import LiskAmount from './../liskAmount';
import { FontIcon } from '../fontIcon';
import ResultsList from './resultsList';
import routes from './../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import localJSONStorage from './../../utils/localJSONStorage';
import regex from './../../utils/regex';
import { saveSearch } from './../search/keyAction';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.submitSearch = this.submitSearch.bind(this);
    this.selectedRow = null;
    this.lastSearch = null;
    this.state = {
      show: false,
      value: '',
      selectedIdx: -1,
      resultsLength: 0,
      placeholder: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.selectedRow = null;
    const resultsLength = ['delegates', 'addresses', 'transactions'].reduce((total, resultKey) =>
      total + nextProps.results[resultKey].length, 0);
    let placeholder = '';
    let selectedIdx = -1;
    if (resultsLength > 0) {
      placeholder = this.getValueFromCurrentIdx(0, nextProps.results);
      selectedIdx = 0;
    }
    this.setState({ resultsLength, selectedIdx, placeholder });
  }

  onResultClick(id, type, value) {
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
    saveSearch(id);
    this.props.searchClearSuggestions();

    if (['addresses', 'transactions'].filter(entity =>
      entity === type).length > 0) {
      this.setState({ value: id });
    } else if (value) {
      this.setState({ value, placeholder: '' });
    } else {
      this.setState({ value: this.state.placeholder });
    }

    this.inputRef.blur();
    this.props.history.push(urlSearch);
  }

  setSelectedRow(el) {
    this.selectedRow = el;
  }

  submitSearch() {
    this.onResultClick(
      this.selectedRow.dataset.id,
      this.selectedRow.dataset.type,
      this.selectedRow.dataset.value,
    );
  }

  submitAnySearch() {
    let searchType = null;
    if (this.state.value.match(regex.address)) {
      searchType = 'addresses';
    } else if (this.state.value.match(regex.transactionId)) {
      searchType = 'transactions';
    }

    if (!searchType) {
      this.props.history.push(`${routes.searchResult.pathPrefix}${routes.searchResult.path}/${encodeURIComponent(this.state.value)}`);
      return;
    }
    this.onResultClick(this.state.value, searchType, this.state.value);
  }

  search(searchTerm) {
    this.setState({ value: searchTerm, placeholder: '' });
    if (searchTerm.length < 3) {
      this.props.searchClearSuggestions();
      return;
    }

    this.setState({ show: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchTerm === this.state.value) {
        this.lastSearch = searchTerm;
        this.props.searchSuggestions({
          activePeer: this.props.activePeer,
          searchTerm: this.state.value,
        });
      }
    }, 250);
  }

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    let placeholder = '';
    if (this.state.resultsLength === 0) {
      currentIdx = (currentIdx === this.recentSearches.length - 1) ?
        this.recentSearches.length - 1 : currentIdx += 1;
      placeholder = this.recentSearches[currentIdx].valueLeft;
    } else {
      currentIdx = (currentIdx === this.state.resultsLength) ?
        this.state.resultsLength : currentIdx += 1;
      placeholder = this.getValueFromCurrentIdx(currentIdx, this.props.results);
    }
    this.setState({ selectedIdx: currentIdx, placeholder });
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === 0) ? 0 : currentIdx -= 1;
    let placeholder = '';
    if (this.state.resultsLength === 0) {
      placeholder = this.recentSearches[currentIdx].valueLeft;
    } else {
      placeholder = this.getValueFromCurrentIdx(currentIdx, this.props.results);
    }
    this.setState({ selectedIdx: currentIdx, placeholder });
  }

  /* eslint-disable class-methods-use-this */
  getValueFromCurrentIdx(index, results) {
    let targetVal = '';
    if (index < results.delegates.length) {
      targetVal = results.delegates[index].username;
    } else if (index <
      results.delegates.length + results.addresses.length) {
      const targetIdx = index - results.delegates.length;
      targetVal = results.addresses[targetIdx].address;
    } else if (index <
      results.delegates.length +
      results.addresses.length +
      results.transactions.length) {
      const targetIdx = index -
        results.delegates.length -
        results.addresses.length;
      targetVal = results.transactions[targetIdx].id;
    }
    return targetVal;
  }
  /* eslint-enable class-methods-use-this */

  handleSubmit() {
    if (this.state.value === '' && this.state.placeholder === '') {
      return;
    }

    if (this.state.resultsLength > 0 || this.state.placeholder !== '') {
      this.submitSearch();
    } else {
      this.submitAnySearch();
    }
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown:
        this.handleArrowDown();
        event.preventDefault();
        break;
      case keyCodes.arrowUp:
        this.handleArrowUp();
        event.preventDefault();
        break;
      case keyCodes.escape:
        this.closeDropdown();
        break;
      case keyCodes.enter:
      case keyCodes.tab:
        this.handleSubmit();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  resetSearch() {
    this.lastSearch = null;
    this.setState({ value: '', placeholder: '' });
    this.props.searchClearSuggestions();
    this.closeDropdown();
  }

  closeDropdown() {
    this.setState({ show: false });
  }

  selectInput() {
    this.inputRef.inputNode.select();
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

  getRecentSearchResults() {
    this.recentSearches = localJSONStorage.get('searches', [])
      .map((result, idx) => {
        let type = 'addresses';
        if (result.match(regex.transactionId)) {
          type = 'transactions';
        }
        return {
          id: result,
          valueLeft: result,
          valueRight: '',
          isSelected: idx === this.state.selectedIdx,
          type,
        };
      });
    return this.recentSearches;
  }

  render() {
    const { t } = this.props;

    const placeholderValue = this.state.placeholder !== '' ?
      this.state.placeholder : t('Search for delegate, Lisk ID, transaction ID');

    return (
      <div className={styles.wrapper}>
        <input value={this.state.placeholder}
          className={`${styles.placeholder} autosuggest-placeholder`}
          type='text'
          name='autosuggest-placeholder' />
        <Input type='text'
          id='autosuggest-input'
          placeholder={placeholderValue}
          name='searchBarInput'
          value={this.state.value}
          innerRef={(el) => { this.inputRef = el; }}
          className={`${styles.input} autosuggest-input`}
          theme={styles}
          onClick={this.selectInput.bind(this)}
          onFocus={() => this.setState({ show: true })}
          onBlur={this.closeDropdown.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off'>
          {
            this.state.value !== '' || this.state.placeholder !== '' ?
              <FontIcon value='close' className={`${styles.icon} autosuggest-btn-close`} onClick={this.resetSearch.bind(this)} /> :
              <FontIcon value='search' className={`${styles.icon} ${styles.iconSearch} autosuggest-btn-search`}
                onClick={this.submitSearch.bind(this)} />
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
          { this.state.value === '' && this.state.resultsLength === 0 ?
            <ResultsList
            key='recent'
            results={this.getRecentSearchResults()}
            header={{
              titleLeft: t('Recent searches'),
              titleRight: '',
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
            : null
          }
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
