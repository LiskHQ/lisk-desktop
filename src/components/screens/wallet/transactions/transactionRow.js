import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import TransactionAddress from '../../../shared/transactionAddress';
import TransactionAmount from '../../../shared/transactionAmount';
import Spinner from '../../../toolbox/spinner';
import TransactionAsset from './txAsset';
import styles from './transactions.css';

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
  const isLSK = activeToken === tokenMap.LSK.key;
  const isConfirmed = data.confirmations > 0;
  return (
    <Link
      className={`${grid.row} ${className} ${isConfirmed ? '' : styles.pending} transactions-row`}
      to={`${routes.transactions.path}/${data.id}`}
    >
      <span className={grid[isLSK ? 'col-xs-4' : 'col-xs-5']}>
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
            <span className={`${grid['col-xs-3']} ${grid['col-md-2']}`}>
              <TransactionAsset t={t} transaction={data} />
            </span>
          )
          : null
      }
      <span className={grid['col-xs-2']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          sender={data.senderId}
          recipient={data.recipientId || data.asset.recipientId}
          type={data.type}
          amount={data.amount || data.asset.amount}
        />
      </span>
    </Link>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
