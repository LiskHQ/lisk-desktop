import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import { tokenMap } from '@token/configuration/tokens';
import { getTxAmount } from '@transaction/utilities/transaction';
import DateTimeFromTimestamp from '@basics/timestamp';
import LiskAmount from '@shared/liskAmount';
import TransactionTypeFigure from '@transaction/detail/info/transactionTypeFigure';
import TransactionAmount from '@transaction/detail/info/transactionAmount';
import TransactionAddress from '@wallet/detail/info/accountVisual/transactionAddress';
import Spinner from '@basics/spinner';
import DialogLink from '@basics/dialog/link';
import TransactionAsset from './txAsset';
import styles from './transactions.css';

const TransactionRow = ({
  data, className, t, host, delegates,
}) => {
  const {
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const isPending = data.isPending;
  const senderAddress = data.sender.address;
  const recipientAddress = data.asset.recipient?.address;
  const address = host === recipientAddress ? senderAddress : recipientAddress;
  const amount = getTxAmount(data);

  return (
    <DialogLink
      className={`${grid.row} ${className} ${isPending ? styles.pending : ''} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <span className={grid['col-xs-4']}>
        <TransactionTypeFigure
          icon={host === recipientAddress ? 'incoming' : 'outgoing'}
          address={address}
          moduleAssetId={data.moduleAssetId}
        />
        <span>
          <TransactionAddress
            address={address}
            bookmarks={bookmarks}
            t={t}
            token={activeToken}
            moduleAssetId={data.moduleAssetId}
          />
        </span>
      </span>
      <span className={grid['col-xs-2']}>
        {
          isPending
            ? <Spinner completed={!isPending} label={t('Pending...')} />
            : <DateTimeFromTimestamp time={data.block.timestamp} token={activeToken} />
        }
      </span>
      <span className={grid['col-xs-2']}>
        <LiskAmount val={data.fee} token={activeToken} />
      </span>
      <span className={grid['col-xs-2']}>
        <TransactionAsset t={t} transaction={data} delegates={delegates} />
      </span>
      <span className={grid['col-xs-2']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          recipient={recipientAddress}
          moduleAssetId={data.moduleAssetId}
          amount={amount}
        />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (
    prevProps.data.id === nextProps.data.id
    && prevProps.currentBlockHeight === nextProps.currentBlockHeight
    && Object.keys(prevProps.delegates).length === Object.keys(nextProps.delegates).length
  );

export default React.memo(TransactionRow, areEqual);
