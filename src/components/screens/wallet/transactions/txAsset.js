import React from 'react';

import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import { truncateAddress } from '../../../../utils/account';
import styles from './transactions.css';

const generateVotes = (asset) => {
  const voteElements = asset.votes.slice(0, 2).map(vote => (
    <div key={vote.delegateAddress} className={styles.voteItem}>
      <span className={styles.username}>{truncateAddress(vote.delegateAddress)}</span>
      <span>
        <LiskAmount val={vote.amount} token={tokenMap.LSK.key} />
      </span>
    </div>
  ));

  return (
    <div className={styles.voteDetails}>
      { voteElements }
      {
        asset.votes.length > 2 && (
          <span className={styles.more}>{`${asset.votes.length - 2} more...`}</span>
        )
      }
    </div>
  );
};

const TransactionAsset = ({
  transaction,
}) => {
  const {
    asset, username, type, token,
  } = transaction;
  let data = token !== 'BTC' ? '-' : '';
  let className = '';
  switch (type) {
    case 2:
      data = asset && asset.delegate ? asset.delegate.username : username;
      break;
    case 3:
      className = styles.delegateVote;
      data = asset && asset.votes ? generateVotes(asset) : data;
      break;
    default:
      data = asset && asset.data ? asset.data : data;
      break;
  }

  return (
    <div className="transaction-reference">
      <span className={`${styles.txDetails} ${className}`}>{data}</span>
    </div>
  );
};

export default TransactionAsset;
