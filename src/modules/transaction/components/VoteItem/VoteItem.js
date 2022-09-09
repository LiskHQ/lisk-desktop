import React from 'react';
import { Link } from 'react-router-dom';

import { truncateAddress } from '@wallet/utils/account';
import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import TokenAmount from '@token/fungible/components/tokenAmount';

import styles from './VoteItem.css';

const token = tokenMap.LSK.key;

/**
 * Displays address/delegate username along with vote amount
 *
 * @param {Object} vote object containing either or both the confirmed and unconfirmed
 * vote amount values
 * @param {String} address the address to redirect to, also used as primary text if
 * title is not defined
 * @param {String} title text to use instead of the address e.g. delegate username
 * @param {Boolean} truncate text to use instead of the address e.g. delegate username
 */
const VoteDetails = ({ vote, address, title, truncate }) => {
  const accountPath = routes.explorer.path;
  return (
    <span className={styles.container}>
      <Link to={`${accountPath}?address=${address}`}>
        <span className={`${styles.primaryText} vote-item-address`}>
          {title ?? (truncate ? truncateAddress(address) : address)}
        </span>
      </Link>
      <span className={`${styles.value} vote-item-value`}>
        {vote.confirmed && vote.unconfirmed ? (
          <>
            <TokenAmount val={vote.confirmed} token={token} />
            <span className={styles.arrowIcon}>➞</span>
            <TokenAmount val={vote.unconfirmed} token={token} />
          </>
        ) : (
          <TokenAmount val={Object.values(vote)[0]} token={token} />
        )}
      </span>
    </span>
  );
};

export default VoteDetails;
