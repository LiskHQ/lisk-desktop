import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';
import TransactionAsset from './txAsset';

const TransactionRow = ({ data, className, t }) => (
  <Link
    className={`${grid.row} ${className}`}
    to={`${routes.transactions.path}/${data.id}`}
  >
    <span className={`${grid['col-xs-5']} ${grid['col-md-4']}`}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-xs-2']}>
      <DateTimeFromTimestamp time={data.timestamp} token="LSK" />
    </span>
    <span className={grid['col-xs-2']}>
      <LiskAmount val={data.fee} token={tokenMap.LSK.key} />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-2']}`}>
      <TransactionAsset t={t} transaction={data} />
    </span>
    <span className={grid['col-xs-2']}>
      <LiskAmount val={data.amount} token={tokenMap.LSK.key} />
    </span>
  </Link>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
