import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';

const BlockRow = React.memo(({ data, className }) => (
  <Link
    key={data.id}
    className={`${grid.row} ${className}`}
    to={`${routes.blocks.path}/${data.id}`}
  >
    <span className={grid['col-md-1']}>
      {data.height}
    </span>
    <span className={grid['col-md-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-md-3']}>
      {data.numberOfTransactions}
    </span>
    <span className={grid['col-md-2']}>
      {data.totalAmount}
    </span>
    <span className={grid['col-md-2']}>
      {data.generatorUsername}
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.totalForged} token="LSK" />
    </span>
  </Link>
));

export default BlockRow;
