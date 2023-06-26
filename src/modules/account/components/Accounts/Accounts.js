import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import WalletList from '@wallet/components/walletList';
import { Input } from 'src/theme';
import Icon from '@theme/Icon';
import { useFilter } from '@common/hooks';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import styles from './accounts.css';

const Accounts = () => {
  const { t } = useTranslation();
  const timeout = useRef();
  const [search, setSearch] = useState('');
  const { data: tokens } = useTokenBalances();
  const token = tokens?.data?.[0];
  const tokenID = token?.tokenID;
  const { filters, setFilter } = useFilter({ sort: 'balance:desc', tokenID });

  useEffect(() => {
    setFilter('tokenID', tokenID);
  }, [token?.tokenID]);

  const handleFilter = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('address', value);
    }, 500);
  };

  return (
    <Box main className="accounts-box">
      <BoxHeader>
        <h1>{t('All accounts')}</h1>
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
      </BoxHeader>
      <BoxContent className={styles.content}>
        <WalletList token={token} filters={filters} />
      </BoxContent>
    </Box>
  );
};

export default Accounts;
