import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'src/theme/Icon';
import Converter from '@common/components/converter';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import TokenAmount from '@token/fungible/components/tokenAmount';
import routes from 'src/routes/routes';
import styles from './TokenCard.css';

const liskSymbol = 'LSK';

const TokenCard = ({ lockedBalance, token }) => {
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
          <Converter
            className={styles.fiatBalance}
            value={convertFromBaseDenom(availableBalance, token)}
          />
        )}
        {lockedBalance > 0 && (
          <Link
            data-testid="locked-balance"
            className={styles.lockedBalance}
            to={`${routes.validators.path}/profile/stakes?modal=lockedBalance`}
          >
            <Icon name="lock" /> <TokenAmount val={lockedBalance} token={token} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
