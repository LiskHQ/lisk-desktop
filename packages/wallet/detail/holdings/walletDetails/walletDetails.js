import React from 'react';
import { Link } from 'react-router-dom';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import BoxRow from '@basics/box/row';
import Icon from 'src/theme/Icon';
import Converter from '@shared/converter';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import LockedBalanceLink from '../balanceInfo/unlocking';
import styles from './walletDetails.css';

const WalletDetails = ({
  t, wallet, token, className, isWalletRoute,
}) => {
  const tokens = Object.entries(wallet.info || {}).filter(
    ([key, info]) => token.list[key] && info,
  );

  return (
    <Box className={`${styles.box} ${className}`}>
      <BoxHeader>
        <h1>{t('Wallet details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        {tokens.map(([acctToken, info]) => (
          <BoxRow
            key={`${info.address}-${acctToken}`}
            className={`${styles.row} coin-row`}
          >
            <Link
              to={routes.wallet.path}
              className={styles.link}
            >
              <Icon name={acctToken === tokenMap.BTC.key ? 'btcIcon' : 'lskIcon'} />
              <div className={styles.details}>
                <span>
                  {t('{{acctToken}} balance', { token: tokenMap[acctToken].label })}
                </span>
                <div className={styles.valuesRow}>
                  <DiscreetMode>
                    <div className={`${styles.cryptoValue} balance-value`}>
                      <div><LiskAmount val={info.summary?.balance} token={acctToken} /></div>
                      <div>
                        <Converter
                          className={styles.fiatValue}
                          value={fromRawLsk(info.summary?.balance)}
                          error=""
                        />
                      </div>
                    </div>
                    {token === tokenMap.LSK.key ? (
                      <LockedBalanceLink
                        activeToken={acctToken}
                        isWalletRoute={isWalletRoute}
                        style={styles.lockedBalance}
                        icon="lockedBalance"
                        account={wallet.info.LSK}
                      />
                    ) : null}
                  </DiscreetMode>
                </div>
              </div>
            </Link>
          </BoxRow>
        ))}
      </BoxContent>
    </Box>
  );
};

export default WalletDetails;
