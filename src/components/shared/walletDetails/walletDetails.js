import React from 'react';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import BoxRow from '../../toolbox/box/row';
import LiskAmount from '../liskAmount';
import { tokenMap } from '../../../constants/tokens';
import DiscreetMode from '../discreetMode';
import styles from './walletDetails.css';
import Icon from '../../toolbox/icon';

const MyAccount = ({
  t, account, settings, className,
}) => {
  const info = account.info || {};
  const token = settings.token;

  const coins = Object.entries(info)
    .map(([key, coin]) => token.list[key] && coin)
    .filter(coin => coin);

  return (
    <Box className={`${styles.box} ${className}`}>
      <BoxHeader>
        <h1>{t('Wallet details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        {
        coins.map(coin => (
          <BoxRow key={coin.token} className={`${styles.row} coin-row`}>
            <Icon name={coin.token === tokenMap.LSK.key ? 'lskIcon' : 'btcIcon'} />
            <div className={styles.details}>
              <span>{t('{{token}} balance', { token: tokenMap[coin.token].label })}</span>
              <DiscreetMode>
                <span className={styles.amounts}>
                  <LiskAmount val={coin.balance} token={coin.token} />
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
