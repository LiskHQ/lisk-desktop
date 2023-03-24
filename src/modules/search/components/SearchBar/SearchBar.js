/* eslint-disable complexity, max-statements */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { keyCodes } from 'src/utils/keyCodes';
import routes from 'src/routes/routes';
import { Input } from 'src/theme';
import Wallet from '@wallet/components/searchBarWallets';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import Validators from 'src/modules/wallet/components/searchBarWallets/validators';
import Blocks from '@block/components/BlockResultList';
import IconSearch from "@search/components/IconSearch/IconSearch";
import Transactions from '../../../transaction/components/TransactionResultList';
import styles from './SearchBar.css';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearch } from '../../hooks/useSearch';

const SearchBar = ({ className, history }) => {
  const [searchTextValue, setSearchTextValue] = useState('');
  const [rowItemIndex, setRowIndex] = useState(0);
  const searchBarRef = useRef();
  const { data: tokens } = useTokensBalance();
  const token = tokens?.data?.[0] || {};

  const debouncedSearchTerm = useDebounce(searchTextValue, 500);
  const { addresses, validators, transactions, blocks, isLoading } = useSearch(debouncedSearchTerm);

  const { t } = useTranslation();

  const onChangeSearchTextValue = ({ target: { value } }) => {
    setSearchTextValue(value);
  };

  const clearSearch = () => {
    setSearchTextValue('');
  };

  const onSelectedRow = (type, value) => {
    if (type === 'transactions') {
      history.push(`${routes.transactionDetails.path}?transactionID=${value}`);
    } else if (type === 'validator-account') {
      history.push(`${routes.validatorProfile.path}?${routes.explorer.searchParam}=${value}`);
    } else {
      history.push(`${routes[type].path}?${routes[type].searchParam}=${value}`);
    }
    clearSearch();
  };

  const onKeyPressDownOrUp = (action, totalRows) => {
    if (action === keyCodes.arrowDown && rowItemIndex < totalRows - 1) {
      setRowIndex(rowItemIndex + 1);
    }

    if (action === keyCodes.arrowUp && rowItemIndex > 0) {
      setRowIndex(rowItemIndex - 1);
    }
  };

  const onSelectAccount = (value) => onSelectedRow('explorer', value);
  const onSelectValidatorAccount = (value) => onSelectedRow('validator-account', value);
  const onSelectTransaction = (value) => onSelectedRow('transactions', value);
  const onSelectBlock = (value) => onSelectedRow('block', value);

  const onKeyPress = () => {
    if (addresses.length) {
      onSelectAccount(addresses[rowItemIndex].address);
    }
    if (validators.length) {
      onSelectValidatorAccount(validators[rowItemIndex]?.address);
    }
    if (transactions.length) {
      onSelectTransaction(transactions[rowItemIndex].id);
    }
    if (blocks.length) {
      onSelectBlock(blocks[rowItemIndex].id);
    }
  };

  const onHandleKeyPress = (e) => {
    const suggestionsLength = addresses.length || validators.length || transactions.length;

    if (suggestionsLength >= 1) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
        case keyCodes.arrowUp:
          onKeyPressDownOrUp(e.keyCode, suggestionsLength);
          break;
        case keyCodes.enter:
          onKeyPress();
          break;
        default:
          break;
      }
    }
  };

  const updateRowItemIndex = ({ target }) => {
    const newIndex = +target.dataset.index;
    setRowIndex(newIndex);
  };

  const isSearchTextError = searchTextValue.length && searchTextValue.length < 3;
  const isEmptyResults =
    !isLoading &&
    !addresses.length &&
    !validators.length &&
    !transactions.length &&
    !blocks.length &&
    searchTextValue.length &&
    !isSearchTextError;

  let feedback = isSearchTextError
    ? t('A bit more. Make sure to type at least 3 characters.')
    : null;
  feedback = isEmptyResults
    ? t('Nothing has been found for your search')
    : feedback;

  return (
    <div className={className}>
      <div className={`${styles.wrapper} search-bar`}>
        <Input
          className="search-input"
          iconClassName={styles.icon}
          icon={<IconSearch />}
          size="s"
          data-name="searchInput"
          setRef={searchBarRef}
          autoComplete="off"
          onChange={onChangeSearchTextValue}
          name="searchText"
          value={searchTextValue}
          placeholder={t('Search within the network...')}
          onKeyDown={onHandleKeyPress}
          isLoading={isLoading}
        />
      </div>
      {feedback && (
        <span className={`${styles.searchFeedback} search-bar-feedback`}>{feedback}</span>
      )}
      {!!addresses.length && (
        <Wallet
          wallets={addresses}
          onSelectedRow={onSelectAccount}
          rowItemIndex={rowItemIndex}
          updateRowItemIndex={updateRowItemIndex}
          t={t}
        />
      )}
      {!!validators.length && (
        <Validators
          searchTextValue={searchTextValue}
          validators={validators}
          onSelectedRow={onSelectValidatorAccount}
          rowItemIndex={rowItemIndex}
          updateRowItemIndex={updateRowItemIndex}
          t={t}
        />
      )}
      {!!transactions.length && (
        <Transactions
          transactions={transactions}
          onSelectedRow={onSelectTransaction}
          rowItemIndex={rowItemIndex}
          updateRowItemIndex={updateRowItemIndex}
          t={t}
          activeToken={token}
        />
      )}
      {!!blocks.length && <Blocks blocks={blocks} onSelectedRow={onSelectBlock} t={t} />}
    </div>
  );
};

export default withRouter(SearchBar);
