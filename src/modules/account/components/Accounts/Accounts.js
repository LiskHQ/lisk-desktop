import React, { useEffect } from 'react';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import WalletList from '@wallet/components/walletList';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useFilter } from '@common/hooks';
import { useNetworkSupportedTokens, useTokenSummary } from '@token/fungible/hooks/queries';
import Overview from '../Overview/overview';
import styles from './accounts.css';

const Accounts = () => {
  const [currentApplication] = useCurrentApplication();

  const networkSupportedTokens = useNetworkSupportedTokens(currentApplication);
  const tokenID = networkSupportedTokens?.data?.[0]?.tokenID;
  const { data: tokenSummary } = useTokenSummary();
  const { filters, setFilter } = useFilter({ tokenID });

  useEffect(() => {
    setFilter('tokenID', tokenID);
  }, [networkSupportedTokens.isFetched]);

  return (
    <Box main className="accounts-box">
      <BoxHeader>
        <Overview tokenData={networkSupportedTokens} setFilter={setFilter} />
      </BoxHeader>
      <BoxContent className={styles.content}>
        <WalletList
          tokenData={networkSupportedTokens}
          tokenSummary={tokenSummary}
          filters={filters}
        />
      </BoxContent>
    </Box>
  );
};

export default Accounts;
