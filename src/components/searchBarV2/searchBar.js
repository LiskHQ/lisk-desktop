import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import Accounts from './accounts';
import Delegates from './delegates';
import Transactions from './transactions';
import routes from '../../constants/routes';
import regex from '../../utils/regex';
import keyCodes from '../../constants/keyCodes';
import styles from './searchBar.css';

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchTextValue: '',
      isLoading: false,
      rowItemIndex: 0,
    };

    this.onChangeSearchTextValue = this.onChangeSearchTextValue.bind(this);
    this.onSelectAccount = this.onSelectedRow.bind(this, 'accounts');
    this.onSelectTransaction = this.onSelectedRow.bind(this, 'transactions');
    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.updateRowItemIndex = this.updateRowItemIndex.bind(this);
  }

  componentDidMount() {
    if (!this.state.searchTextValue.length) this.props.clearSearchSuggestions();
  }

  // eslint-disable-next-line class-methods-use-this
  isSubmittedStringValid(text) {
    return regex.address.test(text)
      || regex.transactionId.test(text)
      || regex.delegateName.test(text);
  }

  onChangeSearchTextValue({ target: { value: searchTextValue } }) {
    const { searchSuggestions, clearSearchSuggestions } = this.props;
    const isTextValid = this.isSubmittedStringValid(searchTextValue);

    this.setState({ searchTextValue, rowItemIndex: 0 });
    if (searchTextValue.length > 2 && isTextValid) {
      this.setState({ isLoading: true });
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        searchSuggestions({
          searchTerm: this.state.searchTextValue,
          callback: () => {
            this.setState({ isLoading: false });
          },
        });
      }, 500);
    } else {
      clearSearchSuggestions();
    }
  }

  clearSearch() {
    this.setState({ searchTextValue: '' });
    this.props.clearSearchSuggestions();
  }

  onSelectedRow(type, value) {
    this.props.history.push(`${routes[type].pathPrefix}${routes[type].path}/${value}`);
    this.clearSearch();
    this.props.onSearchClick();
  }

  onKeyPressDownOrUp(action, totalRows) {
    const { rowItemIndex } = this.state;

    if (action === keyCodes.arrowDown && rowItemIndex < totalRows - 1) {
      this.setState({ rowItemIndex: rowItemIndex + 1 });
    }

    if (action === keyCodes.arrowUp && rowItemIndex > 0) {
      this.setState({ rowItemIndex: rowItemIndex - 1 });
    }
  }

  onKeyPress() {
    const { suggestions: { addresses, delegates, transactions } } = this.props;
    const { rowItemIndex } = this.state;

    if (addresses.length) this.onSelectAccount(addresses[rowItemIndex].address);
    if (delegates.length) this.onSelectAccount(delegates[rowItemIndex].account.address);
    if (transactions.length) this.onSelectTransaction(transactions[rowItemIndex].id);
  }

  onHandleKeyPress(e) {
    const { suggestions } = this.props;
    const suggestionsLength = suggestions.addresses.length
      || suggestions.delegates.length
      || suggestions.transactions.length;

    // istanbul ignore else
    if (suggestionsLength >= 1) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
        case keyCodes.arrowUp:
          this.onKeyPressDownOrUp(e.keyCode, suggestionsLength);
          break;
        case keyCodes.enter:
          this.onKeyPress();
          break;
        // istanbul ignore next
        default:
          break;
      }
    }
  }

  updateRowItemIndex({ target }) {
    const rowItemIndex = +target.dataset.index;
    this.setState({ rowItemIndex });
  }

  // eslint-disable-next-line complexity
  render() {
    const { searchTextValue, isLoading, rowItemIndex } = this.state;
    const { t, suggestions, setSearchBarRef } = this.props;
    const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
    const isEmptyResults = !isLoading && !suggestions.addresses.length
      && !suggestions.delegates.length
      && !suggestions.transactions.length
      && searchTextValue.length
      && !isSearchTextError;

    let error = isSearchTextError ? t('A bit more. Make sure to type at least 3 characters.') : null;
    error = isEmptyResults ? t('Nothing has been found. Make sure to double check the ID you typed.') : error;

    return (
      <div className={`${styles.wrapper} search-bar`}>
        <InputV2
          icon="searchInput"
          size="m"
          data-name="searchInput"
          setRef={setSearchBarRef}
          autoComplete="off"
          onChange={this.onChangeSearchTextValue}
          name="searchText"
          value={searchTextValue}
          placeholder={t('Search within the network...')}
          className="search-input"
          onKeyDown={this.onHandleKeyPress}
          isLoading={isLoading}
        />
        {error
          ? (
            <div className={`${styles.searchMessage} search-message`}>
              <span className="search-message">{error}</span>
            </div>
          )
          : null }
        {
          suggestions.addresses.length
            ? (
              <Accounts
                accounts={suggestions.addresses}
                onSelectedRow={this.onSelectAccount}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
              />
            )
            : null
        }
        {
          suggestions.delegates.length
            ? (
              <Delegates
                delegates={suggestions.delegates}
                onSelectedRow={this.onSelectAccount}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
              />
            )
            : null
        }
        {
          suggestions.transactions.length
            ? (
              <Transactions
                transactions={suggestions.transactions}
                onSelectedRow={this.onSelectTransaction}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
              />
            )
            : null
        }
      </div>
    );
  }
}

export default SearchBar;
