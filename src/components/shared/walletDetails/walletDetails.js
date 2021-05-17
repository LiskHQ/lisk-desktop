import React from 'react';
import { tokenMap } from '@constants';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxRow from '@toolbox/box/row';
import Icon from '@toolbox/icon';
import LiskAmount from '../liskAmount';
import DiscreetMode from '../discreetMode';
import styles from './walletDetails.css';

const MyAccount = ({
  t, account, settings, className,
}) => {
  const tokens = Object.entries(account.info || {})
    .filter(([key, info]) => settings.token.list[key] && info);

  return (
    <Box className={`${styles.box} ${className}`}>
      <BoxHeader>
        <h1>{t('Wallet details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        {
        tokens.map(([token, info]) => (
          <BoxRow key={`${info.address}-${token}`} className={`${styles.row} coin-row`}>
            <Icon name={token === tokenMap.BTC.key ? 'btcIcon' : 'lskIcon'} />
            <div className={styles.details}>
              <span>{t('{{token}} balance', { token: tokenMap[token].label })}</span>
              <DiscreetMode>
                <span className={styles.amounts}>
                  <LiskAmount
                    val={info.summary?.balance}
                    token={token}
                  />
                </span>
              </DiscreetMode>
            </div>
          </BoxRow>
        ))
      }
      </BoxContent>
    </Box>
  );
};

export default MyAccount;
