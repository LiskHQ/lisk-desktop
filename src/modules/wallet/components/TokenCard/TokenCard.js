import React from 'react';
import DialogLink from 'src/theme/dialog/link';
import Icon from 'src/theme/Icon';
import Converter from 'src/modules/common/components/converter';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import styles from './TokenCard.css';

const liskSymbol = 'LSK';

const TokenCard = ({ lockedBalance, availableBalance, symbol, url, address }) => (
  <div data-testid="token-card" className={styles.wrapper}>
    <div className={!lockedBalance || symbol?.toUpperCase?.() !== liskSymbol ? styles.vCenter : ''}>
      <img alt={symbol} className={styles.tokenLogo} src={url} />
    </div>
    <div>
      <TokenAmount className={styles.tokenAmount} val={availableBalance} token={symbol} />
      {symbol === 'LSK' && (
        <Converter
          className={styles.fiatBalance}
          value={fromRawLsk(availableBalance)}
        />
      )}
      {!lockedBalance ? null : (
        <DialogLink
          data-testid="locked-balance"
          component="lockedBalance"
          data={{ address }}
          className={styles.lockedBalance}
        >
          <Icon name="lock" /> <TokenAmount val={lockedBalance} token={symbol} />
        </DialogLink>
      )}
    </div>
  </div>
);

export default TokenCard;
