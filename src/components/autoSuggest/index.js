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

    searchResults = this.props.results || searchResults;

    this.delegatesPropsMap = {
      uniqueKey: 'address',
      redirectPath: entity => `${routes.accounts.pathPrefix}${routes.accounts.path}/${entity.address}`,
      keyHeader: 'username',
      keyValue: entity => (<span>{entity.rank}</span>),
      i18Header: this.props.t('Delegate'),
      i18Value: this.props.t('Rank'),
    };

    this.addressesPropsMap = {
      uniqueKey: 'address',
      redirectPath: entity => `${routes.accounts.pathPrefix}${routes.accounts.path}/${entity.address}`,
      keyHeader: 'address',
      keyValue: entity => (<span><LiskAmount val={entity.balance}/> LSK</span>),
      i18Header: this.props.t('Address'),
      i18Value: this.props.t('Balance'),
    };

    this.transactionsPropsMap = {
      uniqueKey: 'id',
      redirectPath: entity => `${routes.transactions.pathPrefix}${routes.transactions.path}/${entity.id}`,
      keyHeader: 'id',
      keyValue: entity => (<span>{entity.height}</span>),
      i18Header: this.props.t('Transaction'),
      i18Value: this.props.t('Height'),
    };

    this.commonProps = {
      submitSearch: this.submitSearch,
      selectedRowProps: {
        ref: this.setSelectedRow.bind(this),
      },
    };

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

  showDropdown() {
    this.setState({ show: true });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t, results } = this.props;

    const delegatesResults = searchResults.delegates || [];
    const addressesResults = searchResults.addresses || [];
    const transactionsResults = searchResults.transactions || [];

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
                onClick={() => { visitAndSaveSearch(this.state.value, this.props.history); }} />
          }
        </Input>
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''} autosuggest-dropdown`}
          onMouseLeave={this.closeDropdown.bind(this)}>
          <ResultsList {...{
            results: delegatesResults,
            entityKey: 'delegates',
            entityIdxStart: 0,
            selectedIdx: this.state.selectedIdx,
            ...this.delegatesPropsMap,
            ...this.commonProps,
          }} />
          <ResultsList {...{
            results: addressesResults,
            entityKey: 'addresses',
            entityIdxStart: delegatesResults.length,
            selectedIdx: this.state.selectedIdx,
            ...this.addressesPropsMap,
            ...this.commonProps,
          }} />
          <ResultsList {...{
            results: transactionsResults,
            entityKey: 'transactions',
            entityIdxStart: delegatesResults.length + addressesResults.length,
            selectedIdx: this.state.selectedIdx,
            ...this.transactionsPropsMap,
            ...this.commonProps,
          }} />
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
