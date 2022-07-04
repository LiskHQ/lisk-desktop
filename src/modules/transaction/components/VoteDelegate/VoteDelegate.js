import React from 'react';
import VoteItem from '../VoteItem';
import styles from '../TransactionInfo/TransactionInfo.css'; // @todo create dedicated css file for this component

const ItemList = ({ items, heading }) => (
  <div className={styles.contentItem}>
    <span className={styles.contentHeading}>{heading}</span>
    <div className={styles.voteItems}>
      {Object.keys(items).map(address => (
        <VoteItem
          key={`vote-item-${address}`}
          address={address}
          vote={items[address]}
          title={items[address].username}
        />
      ))}
    </div>
  </div>
);

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const VoteDelegate = ({
  t, account, summaryInfo,
}) => {
  const addedLength = Object.keys(summaryInfo.added).length;
  const editedLength = Object.keys(summaryInfo.edited).length;
  const removedLength = Object.keys(summaryInfo.removed).length;
  const sentVotes = account?.dpos?.sentVotes?.length ?? 0;

  return (
    <>
      {addedLength ? <ItemList heading={t('Added votes')} items={summaryInfo.added} /> : null}
      {editedLength ? <ItemList heading={t('Changed votes')} items={summaryInfo.edited} /> : null}
      {removedLength ? <ItemList heading={t('Removed votes')} items={summaryInfo.removed} /> : null}
      <div className={styles.infoContainer}>
        <InfoColumn
          title={t('Total votes after confirmation')}
          className="total-votes"
        >
          {`${sentVotes + addedLength - removedLength}/10`}
        </InfoColumn>
      </div>
    </>
  );
};

export default VoteDelegate;
