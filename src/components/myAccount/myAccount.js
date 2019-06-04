import React from 'react';
import Box from '../boxV2';
import LiskAmount from '../liskAmount';
import { tokenMap } from '../../constants/tokens';
import svg from '../../utils/svgIcons';
import styles from './myAccount.css';

const MyAccount = ({ t, account, settings }) => {
  const info = account.info || {};
  const token = settings.token;

  const coins = Object.entries(info)
    .map(coin => (coin[0] === tokenMap[coin[0]].key && token.list[coin[0]] === true) && coin[1])
    .filter(coin => typeof coin === 'object');

  return (
    <Box className={`${styles.box}`}>
      <header>
        <h1>{t('Wallet details')}</h1>
      </header>
      <div className={`${styles.container} coin-container`}>
      {
        coins.map((coin, index) =>
          <div key={index} className={`${styles.row} coin-row`}>
            <img src={coin.token === tokenMap.LSK.key ? svg.lskIcon40 : svg.btcIcon40} />
            <div className={styles.details}>
              <span>{t('{{token}} Balance', { token: tokenMap[coin.token].label })}</span>
              <span><LiskAmount val={coin.balance} /> {coin.token}</span>
            </div>
          </div>)
      }
      </div>
    </Box>
  );
};

export default MyAccount;
