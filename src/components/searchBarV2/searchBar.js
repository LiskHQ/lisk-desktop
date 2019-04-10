import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import Accounts from './accounts';
import Delegates from './delegates';
import Transactions from './transactions';
import ProgressBar from '../toolbox/progressBar/progressBar';
import routes from './../../constants/routes';
import regex from '../../utils/regex';
import keyCodes from './../../constants/keyCodes';
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
    this.onSelectedRow = this.onSelectedRow.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.isSubmittedStringValid = this.isSubmittedStringValid.bind(this);
    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.onKeyPressDownOrUp = this.onKeyPressDownOrUp.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.updateRowItemIndex = this.updateRowItemIndex.bind(this);
  }

  componentDidMount() {
    if (!this.state.searchTextValue.length) this.props.clearSearchSuggestions();
  }

  // eslint-disable-next-line class-methods-use-this
  isSubmittedStringValid(text) {
    return text.match(regex.address)
    || text.match(regex.transactionId)
    || text.match(regex.delegateName);
  }

  onChangeSearchTextValue(e) {
    const { searchSuggestions, clearSearchSuggestions } = this.props;
    const searchTextValue = e.target.value;
    const isTextValid = this.isSubmittedStringValid(searchTextValue);

    this.setState({ searchTextValue, rowItemIndex: 0 });
    if (searchTextValue.length > 2 && isTextValid) {
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.setState({ isLoading: false });
        searchSuggestions({ searchTerm: this.state.searchTextValue });
      }, 500);
    } else {
      clearSearchSuggestions();
    }
  }

  clearSearch() {
    this.setState({ searchTextValue: '' });
    this.props.clearSearchSuggestions();
  }

  onSelectedRow(value, type) {
    let toUrl = '';

    if (type === 'account') toUrl = `${routes.accounts.pathPrefix}${routes.accounts.path}/${value}`;
    if (type === 'transaction') toUrl = `${routes.transactions.pathPrefix}${routes.transactions.path}/${value}`;

    this.props.history.push(toUrl);
    this.clearSearch();
    this.props.onSearchClick();
  }

  onKeyPressDownOrUp(action, totalRows) {
    const { rowItemIndex } = this.state;

    if (action === 'down' && rowItemIndex < totalRows - 1) {
      this.setState(prevState => ({ rowItemIndex: prevState.rowItemIndex + 1 }));
    }

    if (action === 'up' && rowItemIndex > 0) {
      this.setState(prevState => ({ rowItemIndex: prevState.rowItemIndex - 1 }));
    }
  }

  onKeyPress() {
    const { suggestions } = this.props;
    const { rowItemIndex } = this.state;

    if (suggestions.addresses.length) {
      this.onSelectedRow(suggestions.addresses[rowItemIndex].address, 'account');
    }

    if (suggestions.delegates.length) {
      this.onSelectedRow(suggestions.delegates[rowItemIndex].account.address, 'account');
    }

    if (suggestions.transactions.length) {
      this.onSelectedRow(suggestions.transactions[rowItemIndex].id, 'transaction');
    }
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
          this.onKeyPressDownOrUp('down', suggestionsLength);
          break;
        case keyCodes.arrowUp:
          this.onKeyPressDownOrUp('up', suggestionsLength);
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

  updateRowItemIndex(rowItemIndex) {
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

    return (
      <div className={`${styles.wrapper} search-bar`}>
        <InputV2
          setRef={setSearchBarRef}
          autoComplete={'off'}
          onChange={this.onChangeSearchTextValue}
          name='searchText'
          value={searchTextValue}
          placeholder={t('Search for Address, Transaction ID or message')}
          className={`${styles.input} search-input`}
          onKeyDown={this.onHandleKeyPress}
        />
        <div className={`${styles.searchMessage} ${(isSearchTextError || isEmptyResults) && styles.searchMessageError} search-message`}>
          <span className={`${styles.errorMessage} search-message`}>
            {isSearchTextError ? t('Type at least 3 characters') : null}
            {(isEmptyResults) ? t('No results found.') : null}
          </span>
        </div>
        {
          suggestions.addresses.length
          ? (<Accounts
              accounts={suggestions.addresses}
              onSelectedRow={this.onSelectedRow}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={this.updateRowItemIndex}
              t={t}
            />)
          : null
        }
        {
          suggestions.delegates.length
          ? (<Delegates
              delegates={suggestions.delegates}
              onSelectedRow={this.onSelectedRow}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={this.updateRowItemIndex}
              t={t}
            />)
          : null
        }
        {
          suggestions.transactions.length
          ? (<Transactions
              transactions={suggestions.transactions}
              onSelectedRow={this.onSelectedRow}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={this.updateRowItemIndex}
              t={t}
            />)
          : null
        }
        {
          isLoading
          ? <ProgressBar type="linear" mode="indeterminate" theme={styles} className={'loading'}/>
          : null
        }
      </div>
    );
  }
}

export default SearchBar;
