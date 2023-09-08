import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import { Input } from 'src/theme';
import Icon from '@theme/Icon';
import { getLogo } from '@token/fungible/utils/helpers';
import styles from '../Accounts/accounts.css';

const Overview = ({ tokenData, setFilter }) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const [search, setSearch] = useState('');
  const tokens = tokenData?.data ?? [];
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  useEffect(() => {
    setSelectedToken(tokens[0]);
  }, [tokenData]);

  const handleFilter = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('search', value);
    }, 500);
  };

  const onChange = (tokenInfo) => {
    setSelectedToken(tokenInfo);
    setFilter('tokenID', tokenInfo.tokenID);
  };

  return (
    <>
      <div className={styles.header}>
        <h1>{t('All accounts')}</h1>
      </div>
      <div className={styles.filterWrapper}>
        <span>{t('Filter by :')}</span>
        <MenuSelect
          value={selectedToken}
          onChange={onChange}
          select={(selectedValue, option) => selectedValue?.tokenName === option.tokenName}
          className={styles.menuWrapper}
          popupClassName={styles.popupWrapper}
        >
          {tokens.map((tokenInfo) => (
            <MenuItem
              className={styles.tokenOptionWrapper}
              value={tokenInfo}
              key={tokenInfo.tokenName}
            >
              <img
                className={styles.tokenLogo}
                src={getLogo(tokenInfo)}
                alt={`${tokenInfo.tokenName} logo`}
              />
              <span>{tokenInfo.symbol}</span>
            </MenuItem>
          ))}
        </MenuSelect>
        <span>
          <Input
            icon={<Icon name="searchFilter" />}
            onChange={handleFilter}
            value={search}
            className={`${styles.filterTopAccounts} filter-by-name`}
            iconClassName={styles.searchIcon}
            size="m"
            placeholder={t('Search by name or address')}
          />
        </span>
      </div>
    </>
  );
};

export default Overview;
