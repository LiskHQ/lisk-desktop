import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@common/configuration';
import { fromRawLsk } from '@common/utilities/lsk';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import Converter from '@shared/converter';
import LockedBalanceLink from './unlocking';
import ActionBar from './actionBar';
import styles from './balanceInfo.css';

// eslint-disable-next-line complexity
const BalanceInfo = ({
  t, activeToken, isWalletRoute, account,
}) => {
  const {
    address,
    balance = 0,
  } = account?.summary ?? {};

  const isBanned = account?.dpos?.delegate?.isBanned;
  const pomHeights = account?.dpos?.delegate?.pomHeights;
  const pomStart = pomHeights?.length
    ? { ...pomHeights[pomHeights.length - 1] }
    : {};

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('Balance')}</h2>
        <div className={styles.valuesRow}>
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <div className={`${styles.cryptoValue} balance-value`}>
              <LiskAmount val={balance} token={activeToken} />
              <Converter
                className={styles.fiatValue}
                value={fromRawLsk(balance)}
                error=""
              />
            </div>
            {
            activeToken === tokenMap.LSK.key && (
              <LockedBalanceLink
                activeToken={activeToken}
                isWalletRoute={isWalletRoute}
                account={account}
              />
            )
          }
          </DiscreetMode>
        </div>
        <ActionBar
          address={address}
          username={account?.dpos?.delegate?.username}
          isWalletRoute={isWalletRoute}
          activeToken={activeToken}
          isBanned={isBanned}
          pomStart={pomStart}
        />
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceInfo);
