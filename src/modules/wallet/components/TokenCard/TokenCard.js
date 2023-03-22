import React from 'react';
import DialogLink from 'src/theme/dialog/link';
import Icon from 'src/theme/Icon';
import Converter from '@common/components/converter';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './TokenCard.css';

const liskSymbol = 'LSK';

const TokenCard = ({ lockedBalance, address, token }) => {
  const { symbol, availableBalance } = token;

  return (
    <div data-testid="token-card" className={styles.wrapper}>
      <div
        className={!lockedBalance || symbol?.toUpperCase?.() !== liskSymbol ? styles.vCenter : ''}
      >
        <img alt={symbol} className={styles.tokenLogo} src={getLogo(token)} />
      </div>
      <div>
        <TokenAmount className={styles.tokenAmount} val={availableBalance} token={token} />
        {symbol === 'LSK' && (
          <Converter className={styles.fiatBalance} value={convertFromBaseDenom(availableBalance, token)} />
        )}
        {!lockedBalance ? null : (
          <DialogLink
            data-testid="locked-balance"
            component="lockedBalance"
            data={{ address }}
            className={styles.lockedBalance}
          >
            <Icon name="lock" /> <TokenAmount val={lockedBalance} token={token} />
          </DialogLink>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
