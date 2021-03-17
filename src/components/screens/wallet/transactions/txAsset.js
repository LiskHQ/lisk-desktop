import React from 'react';
import { MODULE_ASSETS } from '@constants';

import VoteItem from '../../../shared/voteItem';
import styles from './transactions.css';

const generateVotes = (asset, delegates) => {
  const voteElements = asset.votes.slice(0, 2).map(vote => (
    <VoteItem
      key={`vote-${vote.delegateAddress}`}
      vote={{ confirmed: vote.amount }}
      address={vote.delegateAddress}
      title={delegates[vote.delegateAddress] && delegates[vote.delegateAddress].username}
      truncate
    />
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

const voteAssetType = MODULE_ASSETS.voteDelegate;
const registerDelegateAssetType = MODULE_ASSETS.registerDelegate;

const TransactionAsset = ({
  transaction, delegates,
}) => {
  const {
    asset, username, type, token,
  } = transaction;
  let data = token !== 'BTC' ? '-' : '';
  let className = '';
  switch (type) {
    case registerDelegateAssetType:
      data = asset?.delegate?.username ?? username;
      break;
    case voteAssetType:
      className = styles.delegateVote;
      data = asset?.votes ? generateVotes(asset, delegates) : data;
      break;
    default:
      data = asset?.data ?? data;
      break;
  }

  return (
    <div className="transaction-reference">
      <span className={`${styles.txDetails} ${className}`}>{data}</span>
    </div>
  );
};

export default TransactionAsset;
