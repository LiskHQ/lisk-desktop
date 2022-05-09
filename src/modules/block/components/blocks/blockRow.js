import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '@screens/router/routes';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './blocks.css';

const BlockRow = ({ data, className }) => (
  <Link
    className={`${grid.row} ${className} ${styles.tableRow} blocks-row`}
    to={`${routes.block.path}?id=${data.id}`}
  >
    <span className={grid['col-xs-3']}>{data.height}</span>
    <span className={grid['col-xs-3']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-xs-3']}>{data.generatorUsername}</span>
    <span className={grid['col-xs-2']}>{data.numberOfTransactions}</span>
    <span className={grid['col-xs-1']}>
      <TokenAmount val={data.totalForged} token="LSK" />
    </span>
  </Link>
);

const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id;

export default React.memo(BlockRow, areEqual);
