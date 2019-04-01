import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import Accounts from './accounts';
import Delegates from './delegates';
import Transactions from './transactions';
import ProgressBar from '../toolbox/progressBar/progressBar';
import routes from './../../constants/routes';
import regex from '../../utils/regex';
import styles from './searchBar.css';

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchTextValue: '',
      isLoading: false,
    };

    this.onChangeSearchTextValue = this.onChangeSearchTextValue.bind(this);
    this.onSelectedRow = this.onSelectedRow.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.isSubmittedStringValid = this.isSubmittedStringValid.bind(this);
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

    if (!isTextValid) return;
    if (isTextValid) this.setState({ searchTextValue });
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
  }

  // eslint-disable-next-line complexity
  render() {
    const { searchTextValue, isLoading } = this.state;
    const { t, suggestions, setSearchBarRef } = this.props;
    const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
    const isEmptyResults = !isLoading && !suggestions.addresses.length
    && !suggestions.delegates.length
    && !suggestions.transactions.length
    && searchTextValue.length
    && !isSearchTextError;

    return (
      <div className={`${styles.wrapper} search-bar`} ref={node => setSearchBarRef(node)}>
        <InputV2
          autoComplete={'off'}
          onChange={this.onChangeSearchTextValue}
          name='searchText'
          value={searchTextValue}
          placeholder={t('Search for Address, Transaction ID or message')}
          className={`${styles.input} search-input`}
        />
        <div className={`${styles.searchMessage} ${(isSearchTextError || isEmptyResults) && styles.searchMessageError} search-message`}>
          <span className={`${styles.errorMessage} search-message`}>
            {isSearchTextError ? t('Type at least 3 characters') : null}
            {(isEmptyResults) ? t('No results found.') : null}
          </span>
        </div>
        {
          suggestions.addresses.length && !isLoading
          ? (<Accounts
              accounts={suggestions.addresses}
              onSelectedRow={this.onSelectedRow}
              t={t}/>)
          : null
        }
        {
          suggestions.delegates.length && !isLoading
          ? (<Delegates
              delegates={suggestions.delegates}
              onSelectedRow={this.onSelectedRow}
              t={t}/>)
          : null
        }
        {
          suggestions.transactions.length && !isLoading
          ? (<Transactions
              transactions={suggestions.transactions}
              onSelectedRow={this.onSelectedRow}
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
