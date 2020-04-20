import React from 'react';
import styles from './transactions.css';

const generateVotes = (asset, t) => {
  const votes = asset.votes.reduce((acc, curr) => ({
    upvotes: (curr.indexOf('+') > -1) ? acc.upvotes + 1 : acc.upvotes,
    downvotes: (curr.indexOf('-') > -1) ? acc.downvotes + 1 : acc.downvotes,
  }), { upvotes: 0, downvotes: 0 });
  return (
    <React.Fragment>
      <span>
        {`↑ ${votes.upvotes} ${t('Votes')},`}
      </span>
      <span>
        {` ↓ ${votes.downvotes} ${t('Unvotes')}`}
      </span>
    </React.Fragment>
  );
};

const TransactionDetail = ({
  transaction, t,
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
      data = asset && asset.votes ? generateVotes(asset, t) : data;
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

export default TransactionDetail;
