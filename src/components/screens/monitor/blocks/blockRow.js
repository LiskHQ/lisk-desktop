import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';

const BlockRow = ({ data, className }) => (
  <Link
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
      {data.generatorUsername}
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.totalAmount} token="LSK" />
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.totalForged} token="LSK" />
    </span>
  </Link>
);

const areEqual = (prevProps, nextProps) => (prevProps.data.id === nextProps.data.id);

export default React.memo(BlockRow, areEqual);
