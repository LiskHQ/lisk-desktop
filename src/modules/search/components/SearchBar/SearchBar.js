/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { keyCodes } from 'src/utils/keyCodes';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import routes from 'src/routes/routes';
import { Input } from 'src/theme';
import Wallet from '@wallet/components/searchBarWallets';
import Delegates from '@wallet/components/searchBarWallets/delegates';
import Blocks from '@block/components/BlockResultList';
import Transactions from '../../../transaction/components/TransactionResultList';
import styles from './SearchBar.css';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ history }) => {
  const [searchTextValue, setSearchTextValue] = useState('');
  const [rowItemIndex, setRowIndex] = useState('');
  const searchBarRef = useRef();

  const debouncedSearchTerm = useDebounce(searchTextValue, 500)

  console.log('debouncedSearchTerm', debouncedSearchTerm);

  const { t } = useTranslation();

  const suggestions = { data: { addresses: [], delegates: [], transactions: [], blocks: [] }, isLoading: false };

  const {
    data: {
      addresses, delegates, transactions, blocks,
    }, isLoading } = suggestions;

  const onChangeSearchTextValue = ({ target: { value } }) => {
    setSearchTextValue(value);
  }

  const clearSearch = () => {
    setSearchTextValue('');
  }

  const onSelectedRow = (type, value) => {
    if (type === 'transactions') {
      addSearchParamsToUrl(history, { modal: 'transactionDetails', transactionId: value });
    } else if (type === 'delegate-account') {
      history.push(`${routes.explorer.path}?${routes.explorer.searchParam}=${value}&tab=delegateProfile`);
    } else {
      history.push(`${routes[type].path}?${routes[type].searchParam}=${value}`);
    }
    clearSearch();
  }

  const onKeyPressDownOrUp = (action, totalRows) => {
    if (action === keyCodes.arrowDown && rowItemIndex < totalRows - 1) {
      setRowIndex(rowItemIndex + 1)
    }

    if (action === keyCodes.arrowUp && rowItemIndex > 0) {
      setRowIndex(rowItemIndex - 1)
    }
  }

  const onSelectAccount = (type) => onSelectedRow(type, 'explorer')
  const onSelectDelegateAccount = (type) => onSelectedRow(type, 'delegate-account')
  const onSelectTransaction = (type) => onSelectedRow(type, 'transactions')
  const onSelectBlock = (type) => onSelectedRow(type, 'block')

  const onKeyPress = () => {
    if (addresses.length) { onSelectAccount(addresses[rowItemIndex].address); }
    if (delegates.length) { onSelectDelegateAccount(delegates[rowItemIndex].summary?.address); }
    if (transactions.length) { onSelectTransaction(transactions[rowItemIndex].id); }
    if (blocks.length) { onSelectBlock(blocks[rowItemIndex].id); }
  }

  const onHandleKeyPress = (e) => {
    const suggestionsLength = addresses.length
      || delegates.length
      || transactions.length;

    // istanbul ignore else
    if (suggestionsLength >= 1) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
        case keyCodes.arrowUp:
          onKeyPressDownOrUp(e.keyCode, suggestionsLength);
          break;
        case keyCodes.enter:
          onKeyPress();
          break;
        // istanbul ignore next
        default:
          break;
      }
    }
  }

  const updateRowItemIndex = ({ target }) => {
    const newIndex = +target.dataset.index;
    setRowIndex(newIndex)
  }

  const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
  const isEmptyResults = !isLoading && !addresses.length
    && !delegates.length
    && !transactions.length
    && !blocks.length
    && searchTextValue.length
    && !isSearchTextError;

  let feedback = isSearchTextError ? t('A bit more. Make sure to type at least 3 characters.') : null;
  feedback = isEmptyResults ? t('Nothing has been found. Make sure to double check the ID you typed.') : feedback;

  return (
    <div>
      <div className={`${styles.wrapper} search-bar`}>
        <Input
          icon="searchActive"
          size="l"
          data-name="searchInput"
          setRef={searchBarRef}
          autoComplete="off"
          onChange={onChangeSearchTextValue}
          name="searchText"
          value={searchTextValue}
          placeholder={t('Search within the network...')}
          className={`${styles.input} search-input`}
          iconClassName={styles.icon}
          onKeyDown={onHandleKeyPress}
          isLoading={suggestions.isLoading}
        />
      </div>
      {feedback ? <span className={`${styles.searchFeedback} search-bar-feedback`}>{feedback}</span> : null}
      {
        suggestions.data.addresses.length
          ? (
            <Wallet
              wallets={suggestions.data.addresses}
              onSelectedRow={onSelectAccount}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={updateRowItemIndex}
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
              onSelectedRow={onSelectDelegateAccount}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={updateRowItemIndex}
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
              onSelectedRow={onSelectTransaction}
              rowItemIndex={rowItemIndex}
              updateRowItemIndex={updateRowItemIndex}
              t={t}
              activeToken="LSK"
            />
          )
          : null
      }
      {
        suggestions.data.blocks.length
          ? (
            <Blocks
              blocks={suggestions.data.blocks}
              onSelectedRow={onSelectBlock}
              t={t}
            />
          )
          : null
      }
    </div>
  );
}

export default withRouter(SearchBar);
