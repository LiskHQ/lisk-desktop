import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import Accounts from './accounts';
import Transactions from './transactions';
import styles from './searchBar.css';

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchTextValue: '',
    };

    this.onChangeSearchTextValue = this.onChangeSearchTextValue.bind(this);
  }

  onChangeSearchTextValue(e) {
    const { searchSuggestions, clearSearchSuggestions } = this.props;
    const searchTextValue = e.target.value;

    this.setState({ searchTextValue });
    if (searchTextValue.length >= 3) {
      searchSuggestions({ searchTerm: searchTextValue });
    } else {
      clearSearchSuggestions();
    }
  }

  render() {
    const { searchTextValue } = this.state;
    const { t, suggestions } = this.props;
    const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
    const isEmptyResults = false;

    return (
      <div className={styles.wrapper}>
        <InputV2
          autoComplete={'off'}
          onChange={this.onChangeSearchTextValue}
          name='searchText'
          value={searchTextValue}
          placeholder={t('Search for Address, Transaction ID or message')}
          className={`${styles.input} search-input`}
        />

        <div className={`${styles.searchMessage} ${(isSearchTextError || isEmptyResults) && styles.searchMessageError} search-message`}>
          <span className={styles.errorMessage}>
            {isSearchTextError ? t('Type at least 3 characters') : null}
            {t('No results found.')}
          </span>
        </div>

        {
          suggestions.addresses.length || suggestions.delegates.length
          ? (<Accounts
              accounts={suggestions.addresses.concat(suggestions.delegates)}
              t={t}/>)
          : null
        }

        {
          suggestions.transactions.length
          ? (<Transactions
              transactions={suggestions.transactions}
              t={t}
            />)
          : null
        }
      </div>
    );
  }
}

export default SearchBar;
