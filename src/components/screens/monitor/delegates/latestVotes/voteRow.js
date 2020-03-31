import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../../../../constants/routes';
import { DateTimeFromTimestamp } from '../../../../toolbox/timestamp';
import LiskAmount from '../../../../shared/liskAmount';
import AccountVisualWithAddress from '../../../../shared/accountVisualWithAddress';

const VoteRow = ({
  data, className,
}) => (
  <Link
    className={`${grid.row} ${className} vote-row`}
    to={`${routes.transactions.path}/${data.id}`}
  >
    <span className={grid['col-md-3']}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={3}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-md-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.balance} token="LSK" />
    </span>
    <span className={grid['col-md-2']}>
      <span>{data.height}</span>
    </span>
    <span className={grid['col-md-3']}>
      <span>votes here</span>
    </span>
  </Link>
);

export default React.memo(VoteRow);
