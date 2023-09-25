import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import Icon from 'src/theme/Icon';
import styles from './blocks.css';

const BlockRow = ({ data, className }) => (
  <Link
    className={`${grid.row} ${className} ${styles.tableRow} blocks-row`}
    data-testid="blocks-row"
    to={`${routes.block.path}?id=${data.id}`}
  >
    <span className={grid['col-xs-2']}>{data.height}</span>
    <span className={grid['col-xs-3']}>
      <DateTimeFromTimestamp time={data.timestamp} tableDateFormat />
    </span>
    <span className={grid['col-xs-3']}>{data.generator.name ?? data.generator.address}</span>
    <span className={grid['col-xs-1']}>{data.numberOfTransactions}</span>
    <span className={grid['col-xs-3']}>
      <Icon name={`${data.isFinal ? 'transactionStatusSuccessful' : 'transactionStatusPending'}`} />
    </span>
  </Link>
);

const areEqual = (prevProps, nextProps) => prevProps.data.id === nextProps.data.id;

export default React.memo(BlockRow, areEqual);
