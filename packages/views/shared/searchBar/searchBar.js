import React from 'react';
import { withRouter } from 'react-router-dom';
import { keyCodes } from '@common/configuration';
import { addSearchParamsToUrl } from '@common/utilities/searchParams';
import routes from '@screens/router/routes';
import { Input } from '@basics/inputs';
import Accounts from './accounts';
import Delegates from './delegates';
import Transactions from './transactions';
import styles from './searchBar.css';
import Blocks from './blocks';

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchTextValue: '',
      rowItemIndex: 0,
    };

    this.onChangeSearchTextValue = this.onChangeSearchTextValue.bind(this);
    this.onSelectAccount = this.onSelectedRow.bind(this, 'account');
    this.onSelectDelegateAccount = this.onSelectedRow.bind(this, 'delegate-account');
    this.onSelectTransaction = this.onSelectedRow.bind(this, 'transactions');
    this.onSelectBlock = this.onSelectedRow.bind(this, 'block');
    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.updateRowItemIndex = this.updateRowItemIndex.bind(this);
  }

  onChangeSearchTextValue({ target: { value: searchTextValue } }) {
    const { suggestions, activeToken } = this.props;

    this.setState({ searchTextValue, rowItemIndex: 0 });
    if (searchTextValue.length > 2) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        suggestions.loadData({
          query: this.state.searchTextValue,
          token: activeToken,
        });
        this.timeout = null;
      }, 500);
    } else {
      suggestions.clearData();
    }
  }

  clearSearch() {
    this.setState({ searchTextValue: '' });
    this.props.suggestions.clearData();
  }

  onSelectedRow(type, value) {
    if (type === 'transactions') {
      addSearchParamsToUrl(this.props.history, { modal: 'transactionDetails', transactionId: value });
    } else if (type === 'delegate-account') {
      this.props.history.push(`${routes.account.path}?${routes.account.searchParam}=${value}&tab=delegateProfile`);
    } else {
      this.props.history.push(`${routes[type].path}?${routes[type].searchParam}=${value}`);
    }
    this.clearSearch();
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
    const {
      suggestions: {
        data: {
          addresses, delegates, transactions, blocks,
        },
      },
    } = this.props;
    const { rowItemIndex } = this.state;

    if (addresses.length) this.onSelectAccount(addresses[rowItemIndex].address);
    if (delegates.length) this.onSelectDelegateAccount(delegates[rowItemIndex].summary?.address);
    if (transactions.length) this.onSelectTransaction(transactions[rowItemIndex].id);
    if (blocks.length) this.onSelectTransaction(blocks[rowItemIndex].id);
  }

  onHandleKeyPress(e) {
    const { suggestions } = this.props;
    const suggestionsLength = suggestions.data.addresses.length
      || suggestions.data.delegates.length
      || suggestions.data.transactions.length;

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
    const { searchTextValue, rowItemIndex } = this.state;
    const {
      t, suggestions, setSearchBarRef, activeToken,
    } = this.props;
    const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
    const isEmptyResults = !suggestions.isLoading && !suggestions.data.addresses.length
      && !suggestions.data.delegates.length
      && !suggestions.data.transactions.length
      && !suggestions.data.blocks.length
      && searchTextValue.length
      && !isSearchTextError;

    let feedback = isSearchTextError ? t('A bit more. Make sure to type at least 3 characters.') : null;
    feedback = isEmptyResults ? t('Nothing has been found. Make sure to double check the ID you typed.') : feedback;

    return (
      <div className={`${styles.wrapper} search-bar`}>
        <Input
          icon="searchActive"
          size="l"
          data-name="searchInput"
          setRef={setSearchBarRef}
          autoComplete="off"
          onChange={this.onChangeSearchTextValue}
          name="searchText"
          value={searchTextValue}
          placeholder={t('Search within the network...')}
          className={`${styles.input} search-input`}
          iconClassName={styles.icon}
          onKeyDown={this.onHandleKeyPress}
          isLoading={suggestions.isLoading || this.timeout}
        />
        { feedback ? <span className={`${styles.searchFeedback} search-bar-feedback`}>{feedback}</span> : null }
        {
          suggestions.data.addresses.length
            ? (
              <Accounts
                accounts={suggestions.data.addresses}
                onSelectedRow={this.onSelectAccount}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
              />
            )
            : null
        }
        {
          suggestions.data.delegates.length
            ? (
              <Delegates
                searchTextValue={searchTextValue}
                delegates={suggestions.data.delegates}
                onSelectedRow={this.onSelectDelegateAccount}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
              />
            )
            : null
        }
        {
          suggestions.data.transactions.length
            ? (
              <Transactions
                transactions={suggestions.data.transactions}
                onSelectedRow={this.onSelectTransaction}
                rowItemIndex={rowItemIndex}
                updateRowItemIndex={this.updateRowItemIndex}
                t={t}
                activeToken={activeToken}
              />
            )
            : null
        }
        {
          suggestions.data.blocks.length
            ? (
              <Blocks
                blocks={suggestions.data.blocks}
                onSelectedRow={this.onSelectBlock}
                t={t}
              />
            )
            : null
        }
      </div>
    );
  }
}

export default withRouter(SearchBar);
