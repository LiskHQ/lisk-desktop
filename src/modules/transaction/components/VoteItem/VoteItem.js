import React from 'react';
import { Link } from 'react-router-dom';

import { truncateAddress } from '@wallet/utils/account';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import LiskAmount from '@shared/liskAmount';

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
const VoteDetails = ({
  vote, address, title, truncate,
}) => {
  const accountPath = routes.explorer.path;
  return (
    <span className={`${styles.container} vote-item-address`}>
      <Link
        to={`${accountPath}?address=${address}`}
      >
        <span className={styles.primaryText}>
          {title || (truncate ? truncateAddress(address) : address)}
        </span>
      </Link>
      <span className={`${styles.value} vote-item-value`}>
        {vote.confirmed && vote.unconfirmed
          ? (
            <>
              <LiskAmount val={vote.confirmed} token={token} />
              <span className={styles.arrowIcon}>➞</span>
              <LiskAmount val={vote.unconfirmed} token={token} />
            </>
          )
          : <LiskAmount val={Object.values(vote)[0]} token={token} />}
      </span>
    </span>
  );
};

export default VoteDetails;
