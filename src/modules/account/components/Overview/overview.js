import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import { Input } from 'src/theme';
import Icon from '@theme/Icon';
import { useTransferableTokens } from '@token/fungible/hooks';
import { getLogo } from '@token/fungible/utils/helpers';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import styles from '../Accounts/accounts.css';

const Overview = (setFilter) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const [search, setSearch] = useState('');
  const [application] = useCurrentApplication();
  const { data: applicationTokens } = useTransferableTokens(application);
  const [selectedToken, setSelectedToken] = useState(applicationTokens);

  useEffect(() => {
    setSelectedToken(applicationTokens[0]);
  }, [applicationTokens]);

  const handleFilter = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('address', value);
    }, 500);
  };

  const onChange = (tokenData) => {
    setSelectedToken(tokenData);
    setFilter('tokenID', tokenData.tokenID);
  };
  return (
    <>
      <div>
        <h1>{t('All accounts')}</h1>
      </div>
      <div className={styles.filterWrapper}>
        <span>Filter by:</span>
        <MenuSelect
          value={selectedToken}
          onChange={onChange}
          select={(selectedValue, option) => selectedValue?.tokenName === option.tokenName}
          className={styles.menuWrapper}
          popupClassName={styles.popupWrapper}
        >
          {applicationTokens.map((tokenValue) => (
            <MenuItem
              className={styles.tokenOptionWrapper}
              value={tokenValue}
              key={tokenValue.tokenName}
            >
              <img
                className={styles.tokenLogo}
                src={getLogo(tokenValue)}
                alt={`${tokenValue.tokenName} logo`}
              />
              <span>{tokenValue.symbol}</span>
            </MenuItem>
          ))}
        </MenuSelect>
        <span>
          <Input
            icon={<Icon className={styles.searchIcon} name="searchActive" />}
            onChange={handleFilter}
            value={search}
            className={`${styles.filterTopAccounts} filter-by-name`}
            size="m"
            placeholder={t('Search by name')}
          />
        </span>
      </div>
    </>
  );
};

export default Overview;
