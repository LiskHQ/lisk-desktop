import React, { useEffect } from 'react';

import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import WalletList from '@wallet/components/walletList';
import { useFilter } from '@common/hooks';
import { useAppsMetaTokens, useTokenSummary } from '@token/fungible/hooks/queries';
import { useFees } from '@transaction/hooks/queries';
import Overview from '../Overview/overview';
import styles from './accounts.css';

const Accounts = () => {
  const { data: fees } = useFees();
  const tokenID = fees?.data?.feeTokenID;
  const { data: tokenSummary } = useTokenSummary();
  const { filters, setFilter } = useFilter({ tokenID });
  const { data: tokenData } = useAppsMetaTokens({
    config: { params: { tokenID }, options: { enable: !tokenID } },
  });

  useEffect(() => {
    setFilter('tokenID', tokenID);
  }, [fees?.data?.feeTokenID]);

  return (
    <Box main className="accounts-box">
      <BoxHeader>
        <Overview setFilter={setFilter} />
      </BoxHeader>
      <BoxContent className={styles.content}>
        <WalletList tokenData={tokenData} tokenSummary={tokenSummary} filters={filters} />
      </BoxContent>
    </Box>
  );
};

export default Accounts;
