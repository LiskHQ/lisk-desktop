import React from 'react';
import Icon from 'src/theme/Icon';
import Converter from 'src/modules/common/components/converter';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import styles from './TokenCard.css';

const TokenCard = ({ lockedBalance, balance, symbol, url, onClick }) => (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={!lockedBalance ? styles.vCenter : ''}>
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
        {lockedBalance && (
          <p>
            <Icon name="lock" /> <TokenAmount val={lockedBalance} token={symbol} />
          </p>
        )}
      </div>
    </div>
  );

export default TokenCard;
