import React from 'react';
import styles from './transactionsV2.css';

const generateVotes = (asset, t) => {
  const votes = asset.votes.reduce((acc, curr) => ({
    upvotes: (curr.indexOf('+') > -1) ? acc.upvotes + 1 : acc.upvotes,
    downvotes: (curr.indexOf('-') > -1) ? acc.downvotes + 1 : acc.downvotes,
  }), { upvotes: 0, downvotes: 0 });
  return (
    <React.Fragment>
      <span>
        {`↑ ${votes.upvotes} ${t('Upvotes')}`},
      </span>
      <span>
        {` ↓ ${votes.downvotes} ${t('Downvotes')}`}
      </span>
    </React.Fragment>
  );
};

const TransactionDetailV2 = ({
  transaction, t,
}) => {
  const { asset, username, type } = transaction;
  let data = '-';
  let className = '';
  switch (type) {
    case 2:
      data = asset && asset.delegate ? asset.delegate.username : username;
      break;
    case 3:
      className = styles.delegateVote;
      data = asset && asset.votes ? generateVotes(asset, t) : data;
      break;
    default:
      data = asset && asset.data ? asset.data : data;
      break;
  }

  return <div className={'transaction-reference'}>
    <span className={`${styles.txDetails} ${className}`}>{data}</span>
  </div>;
};

export default TransactionDetailV2;
