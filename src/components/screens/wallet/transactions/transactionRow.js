import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import TransactionAddress from '../../../shared/transactionAddress';
import TransactionAmount from '../../../shared/transactionAmount';
import Spinner from '../../../toolbox/spinner';
import TransactionAsset from './txAsset';
import DialogLink from '../../../toolbox/dialog/link';
import styles from './transactions.css';
import regex from '../../../../utils/regex';
import withResizeValues from '../../../../utils/withResizeValues';

// eslint-disable-next-line complexity
const TransactionRow = ({
  data, className, t, host, isMediumViewPort
}) => {
  const {
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const isLSK = activeToken === tokenMap.LSK.key;
  const isConfirmed = data.confirmations > 0;
  const transactionAddressRecipientId = host === data.recipientId ? data.senderId : data.recipientId;
  return (
    <DialogLink
      className={`${grid.row} ${className} ${isConfirmed ? '' : styles.pending} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <span className={grid[isLSK ? 'col-xs-4' : 'col-xs-5']}>
        <TransactionTypeFigure
          icon={host === data.recipientId ? 'incoming' : 'outgoing'}
          address={host === data.recipientId ? data.senderId : data.recipientId}
          transactionType={data.type}
        />
        <TransactionAddress
          address={isMediumViewPort ? transactionAddressRecipientId.replace(regex.lskAddressTrunk, '$1...$3') : transactionAddressRecipientId}
          bookmarks={bookmarks}
          t={t}
          token={activeToken}
          transactionType={data.type}
        />
      </span>
      <span className={grid[isLSK ? 'col-xs-2' : 'col-xs-3']}>
        {
          isConfirmed
            ? <DateTimeFromTimestamp time={data.timestamp} token={activeToken} />
            : <Spinner completed={isConfirmed} label={t('Pending...')} />
        }
      </span>
      <span className={grid['col-xs-2']}>
        <LiskAmount val={data.fee} token={activeToken} />
      </span>
      {
        isLSK
          ? (
            <span className={`${grid['col-xs-2']} ${grid['col-md-2']}`}>
              <TransactionAsset t={t} transaction={data} />
            </span>
          )
          : null
      }
      <span className={grid['col-xs-2']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          sender={data.senderId}
          recipient={data.recipientId || data.asset.recipientId}
          type={data.type}
          amount={data.amount || data.asset.amount}
        />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(withResizeValues(TransactionRow), areEqual);
