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

const TransactionDetailV2 = ({ type, asset, t }) => {
  let data = '-';
  let className = '';
  switch (type) {
    case 2:
      data = asset.delegate.username || data;
      break;
    case 3:
      className = styles.delegateVote;
      data = generateVotes(asset, t);
      break;
    default:
      data = asset.data || data;
      break;
  }

  return <div className={'transaction-reference'}>
    <span className={`${styles.txDetails} ${className}`}>{data}</span>
  </div>;
};

export default TransactionDetailV2;
