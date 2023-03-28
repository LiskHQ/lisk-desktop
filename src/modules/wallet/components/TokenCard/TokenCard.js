import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'src/theme/Icon';
import Converter from '@common/components/converter';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import TokenAmount from '@token/fungible/components/tokenAmount';
import routes from 'src/routes/routes';
import styles from './TokenCard.css';

const liskSymbol = 'LSK';

const TokenCard = ({ token }) => {
  const { symbol, availableBalance, lockedBalances } = token;

  const totalLockedBalance = lockedBalances?.reduce((accum, { amount }) => BigInt(amount) + accum, BigInt(0));

  return (
    <div data-testid="token-card" className={styles.wrapper}>
      <div
        className={!totalLockedBalance || symbol?.toUpperCase?.() !== liskSymbol ? styles.vCenter : ''}
      >
        <img alt={symbol} className={styles.tokenLogo} src={getLogo(token)} />
      </div>
      <div>
        <TokenAmount className={styles.tokenAmount} val={availableBalance} token={token} />
        {symbol === 'LSK' && (
          <Converter
            className={styles.fiatBalance}
            value={convertFromBaseDenom(availableBalance, token)}
          />
        )}
        {totalLockedBalance > BigInt(0) && (
          <Link
            className={styles.lockedBalance}
            to={`${routes.sentStakes.path}/?modal=lockedBalance`}
          >
            <Icon name="lock" /> <TokenAmount val={totalLockedBalance} token={token} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
