import React from 'react';
import Icon from 'src/theme/Icon';
import Converter from 'src/modules/common/components/converter';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import styles from './TokenCard.css';

const TokenCard = ({ lockedBalances, availableBalance: balance, symbol, url, onClick }) => (
  <div className={styles.wrapper} onClick={onClick}>
    <div className={!lockedBalances ? styles.vCenter : ''}>
      <img className={styles.tokenLogo} src={url} />
    </div>
    <div>
      <p>
        <TokenAmount val={balance} token={symbol} />
      </p>
      {symbol === 'LSK' && (
        <p>
          <Converter value={fromRawLsk(balance)} />
        </p>
      )}
      {lockedBalances && (
        <p>
          <Icon name="lock" /> <TokenAmount val={lockedBalances[0].amount} token={symbol} />
        </p>
      )}
    </div>
  </div>
);

export default TokenCard;
