import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';

import { tokenMap } from '../../../constants/tokens';
import Icon from '../../toolbox/icon';
import LiskAmount from '../liskAmount';

import styles from './styles.css';

const token = tokenMap.LSK.key;

/**
 * Componenet to display address/delegate username along with vote amount
 * @param vote object containing either or both the confirmed and unconfirmed
 * vote amount values
 * @param address the address to redirect to, also used as primary text if
 * primaryText is not defined
 * @param primaryText text to use instead of the address e.g. delegate username
 */
const VoteItem = ({ vote, address, primaryText }) => {
  const accountPath = routes.account.path;
  return (
    <span className={`${styles.container} vote-item-address`}>
      <Link
        to={`${accountPath}?address=${address}`}
      >
        <span className={styles.primaryText}>{primaryText || address}</span>
      </Link>
      <span>
        {Object.values(vote).length === 2
          ? (
            <>
              <LiskAmount val={vote.confirmed} token={token} />
              <span className={styles.arrowIcon}><Icon name="arrowRightTailed" /></span>
              <LiskAmount val={vote.unconfirmed} token={token} />
            </>
          )
          : <LiskAmount val={Object.values(vote)[0]} token={token} />
          }
      </span>
    </span>
  );
};

export default VoteItem;
