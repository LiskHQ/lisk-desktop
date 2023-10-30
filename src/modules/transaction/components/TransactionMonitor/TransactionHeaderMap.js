import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './transactionsTable.css';

export default (changeSort, t) => [
  {
    title: t('ID'),
    classList: grid['col-xs-2'],
    placeholder: 'walletWithAddress',
  },
  {
    title: t('Sender'),
    classList: grid['col-xs-2'],
    placeholder: 'walletWithAddress',
  },
  {
    title: t('Height'),
    classList: `${grid['col-xs-1']} ${styles.transactionFeeCell}`,
    sort: {
      fn: changeSort,
      key: 'height',
    },
  },
  {
    title: t('Type'),
    classList: `${grid['col-xs-2']} ${grid['col-md-2']}`,
  },
  {
    title: t('Value'),
    classList: `${grid['col-xs-2']} ${grid['col-md-2']}`,
  },
  {
    title: t('Date'),
    classList: `${grid['col-md-2']} ${grid['col-xs-3']}`,
    sort: {
      fn: changeSort,
      key: 'timestamp',
    },
  },
  {
    title: t('Status'),
    classList: grid['col-xs-1'],
  },
];
