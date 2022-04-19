import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import TransactionTypeFigure from '@transaction/detail/info/transactionTypeFigure';
import TransactionAddress from '@wallet/detail/identity/walletVisual/transactionAddress';
import TransactionAmount from '@transaction/detail/info/transactionAmount';
import DialogLink from '@basics/dialog/link';
import styles from './recentTransactions.css';

// eslint-disable-next-line complexity
const TransactionRow = ({
  data, className, t, host, currentBlockHeight,
}) => {
  const {
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const isConfirmed = currentBlockHeight - data.height > 0;
  const unlockAmount = data.asset?.unlockObjects
    ? data.asset.unlockObjects.reduce((total, item) => {
      total += Number(item.amount);
      return total;
    }, 0) : 0;
  const direction = host === data.asset?.recipient?.address ? 'incoming' : 'outgoing';

  return (
    <DialogLink
      className={`${grid.row} ${className} ${isConfirmed ? '' : styles.pending} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <span className={grid['col-xs-8']}>
        <TransactionTypeFigure
          icon={direction}
          address={direction === 'incoming' ? data.sender.address : data.asset?.recipient?.address}
          moduleAssetId={data.moduleAssetId}
        />
        <TransactionAddress
          address={direction === 'incoming' ? data.sender.address : data.asset?.recipient?.address}
          bookmarks={bookmarks}
          t={t}
          token={activeToken}
          moduleAssetId={data.moduleAssetId}
        />
      </span>
      <span className={grid['col-xs-4']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          sender={data.sender.address}
          recipient={data.asset?.recipient?.address}
          moduleAssetId={data.moduleAssetId}
          amount={data.asset?.amount || unlockAmount}
        />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.currentBlockHeight === nextProps.currentBlockHeight);

export default React.memo(TransactionRow, areEqual);
