import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import TransactionAddress from '../../../shared/transactionAddress';
import TransactionAmount from '../../../shared/transactionAmount';
import DialogLink from '../../../toolbox/dialog/link';
import styles from './recentTransactions.css';

// eslint-disable-next-line complexity
const TransactionRow = ({
  data, className, t, host,
}) => {
  const {
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const isConfirmed = data.confirmations > 0;
  const unlockAmount = data.asset && data.asset.unlockingObjects
    && data.asset.unlockingObjects.reduce((total, item) => {
      total += item.amount;
      return total;
    }, 0);
  return (
    <DialogLink
      className={`${grid.row} ${className} ${isConfirmed ? '' : styles.pending} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <span className={grid['col-xs-8']}>
        <TransactionTypeFigure
          icon={host === data.recipientId ? 'incoming' : 'outgoing'}
          address={host === data.recipientId ? data.senderId : data.recipientId}
          transactionType={data.type}
        />
        <TransactionAddress
          address={host === data.recipientId ? data.senderId : data.recipientId}
          bookmarks={bookmarks}
          t={t}
          token={activeToken}
          transactionType={data.type}
        />
      </span>
      <span className={grid['col-xs-4']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          sender={data.senderId}
          recipient={data.recipientId || data.asset.recipientId}
          type={data.type}
          amount={data.amount || data.asset.amount || unlockAmount}
        />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
