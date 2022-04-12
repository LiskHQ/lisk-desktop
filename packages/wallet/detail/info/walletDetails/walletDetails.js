import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { settingsUpdated } from '@common/store/actions';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/configuration/tokens';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import BoxRow from '@basics/box/row';
import Icon from '@basics/icon';
import Converter from '@shared/converter';
import { fromRawLsk } from '@token/utilities/lsk';
import LiskAmount from '@shared/liskAmount';
import LockedBalanceLink from '@screens/managers/wallet/overview/balanceInfo/unlocking';
import DiscreetMode from '@shared/discreetMode';
import styles from './walletDetails.css';

const WalletDetails = ({
  t, account, settings, className, isWalletRoute,
}) => {
  const dispatch = useDispatch();
  const tokens = Object.entries(account.info || {}).filter(
    ([key, info]) => settings.token.list[key] && info,
  );

  return (
    <Box className={`${styles.box} ${className}`}>
      <BoxHeader>
        <h1>{t('Wallet details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        {tokens.map(([token, info]) => (
          <BoxRow
            key={`${info.address}-${token}`}
            className={`${styles.row} coin-row`}
          >
            <Link
              to={routes.wallet.path}
              onClick={() =>
                dispatch(settingsUpdated({ token: { active: token } }))}
              className={styles.link}
            >
              <Icon name={token === tokenMap.BTC.key ? 'btcIcon' : 'lskIcon'} />
              <div className={styles.details}>
                <span>
                  {t('{{token}} balance', { token: tokenMap[token].label })}
                </span>
                <div className={styles.valuesRow}>
                  <DiscreetMode>
                    <div className={`${styles.cryptoValue} balance-value`}>
                      <div><LiskAmount val={info.summary?.balance} token={token} /></div>
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
                        activeToken={token}
                        isWalletRoute={isWalletRoute}
                        style={styles.lockedBalance}
                        icon="lockedBalance"
                        account={account.info.LSK}
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
