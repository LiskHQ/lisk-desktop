import React, { useEffect } from 'react';

import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import WalletList from '@wallet/components/walletList';
import { useFilter } from '@common/hooks';
import { useTokenBalances, useTokenSummary } from '@token/fungible/hooks/queries';
import Overview from '../Overview/overview';
import styles from './accounts.css';

const Accounts = () => {
  const { data: tokens } = useTokenBalances();
  const token = tokens?.data?.[0];
  const tokenID = token?.tokenID;
  const { data: tokenSummary } = useTokenSummary();
  const { filters, setFilter } = useFilter({ tokenID });

  useEffect(() => {
    setFilter('tokenID', tokenID);
  }, [token?.tokenID]);

  return (
    <Box main className="accounts-box">
      <BoxHeader>
        <Overview setFilter={setFilter} />
      </BoxHeader>
      <BoxContent className={styles.content}>
        <WalletList token={token} tokenSummary={tokenSummary} filters={filters} />
      </BoxContent>
    </Box>
  );
};

export default Accounts;
