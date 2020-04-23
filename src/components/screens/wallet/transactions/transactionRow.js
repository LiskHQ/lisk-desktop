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
import TransactionAsset from './txAsset';

const TransactionRow = ({ data, className, t }) => {
  const {
    accounts,
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    accounts: state.account.info,
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const { address } = accounts[activeToken];
  const isLSK = activeToken === tokenMap.LSK.key;
  const dateClass = isLSK ? 'col-xs-2' : 'col-xs-3';
  const addressClass = isLSK ? 'col-xs-4' : 'col-xs-5';
  return (
    <Link
      className={`${grid.row} ${className}`}
      to={`${routes.transactions.path}/${data.id}`}
    >
      <span className={grid[addressClass]}>
        <TransactionTypeFigure
          icon={address === data.recipientId ? 'incoming' : 'outgoing'}
          address={address === data.recipientId ? data.senderId : data.recipientId}
          transactionType={data.type}
        />
        <TransactionAddress
          address={address === data.recipientId ? data.senderId : data.recipientId}
          bookmarks={bookmarks}
          t={t}
          token={activeToken}
          transactionType={data.type}
        />
      </span>
      <span className={grid[dateClass]}>
        <DateTimeFromTimestamp time={data.timestamp} token="LSK" />
      </span>
      <span className={grid['col-xs-2']}>
        <LiskAmount val={data.fee} token={tokenMap[activeToken].key} />
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
          host={address}
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
