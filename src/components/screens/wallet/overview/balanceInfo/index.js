import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import { fromRawLsk } from '@utils/lsk';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import Converter from '@shared/converter';
import LockedBalanceLink from './unlocking';
import ButtonsWrapper from './buttonsWrapper';
import styles from './balanceInfo.css';

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address, username,
}) => (
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
            activeToken === tokenMap.LSK.key && isWalletRoute ? (
              <LockedBalanceLink activeToken={activeToken} isWalletRoute={isWalletRoute} />
            ) : null
          }
        </DiscreetMode>
      </div>
      <ButtonsWrapper
        address={address}
        username={username}
        isWalletRoute={isWalletRoute}
        activeToken={activeToken}
      />
    </BoxContent>
  </Box>
);

export default withTranslation()(BalanceInfo);
