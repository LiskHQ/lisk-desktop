import React from 'react';
import { Link } from 'react-router-dom';

import { truncateAddress } from '@wallet/utils/account';
import routes from 'src/routes/routes';
import TokenAmount from '@token/fungible/components/tokenAmount';

import styles from './StakeItem.css';

/**
 * Displays address/validator username along with stake amount
 *
 * @param {Object} stake object containing either or both the confirmed and unconfirmed
 * stake amount values
 * @param {String} address the address to redirect to, also used as primary text if
 * title is not defined
 * @param {String} title text to use instead of the address e.g. validator username
 * @param {Boolean} truncate text to use instead of the address e.g. validator username
 */
const StakeItem = ({ stake, address, title, truncate, token, reward }) => {
  const accountPath = routes.explorer.path;

  return (
    <span data-testid="stake-item" className={`${styles.container}`}>
      <Link to={`${accountPath}?address=${address}`}>
        <span className={`${styles.primaryText} stake-item-address`}>
          {title ?? (truncate ? truncateAddress(address) : address)}
        </span>
      </Link>
      <span className={`${styles.value} stake-item-value`}>
        {stake.confirmed && stake.unconfirmed ? (
          <>
            <span className={styles.confirmed}>
              <TokenAmount val={stake.confirmed} token={token} />
            </span>
            <span className={styles.arrowIcon} />
            <span className={styles.unconfirmed}>
              <TokenAmount val={stake.unconfirmed} token={token} />
            </span>
          </>
        ) : (
          <>
            <span
              className={
                Number(stake.confirmed) && !Number(stake.unconfirmed) ? styles.confirmed : ''
              }
            >
              <TokenAmount val={Object.values(stake)[0]} token={token} />
            </span>
          </>
        )}
        {!!reward && (
          <span className={styles.reward}>
            <span>Reward:&nbsp;&nbsp;</span>
            <TokenAmount val={reward} token={token} />
          </span>
        )}
      </span>
    </span>
  );
};

export default StakeItem;
