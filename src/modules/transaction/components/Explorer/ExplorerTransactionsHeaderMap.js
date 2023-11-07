import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './ExplorerTransactions.css';

export default (t, activeToken, changeSort) => [
  {
    title: t('Recipient'),
    classList: `${grid['col-xs-3']} ${styles.transactionTitle}`,
  },
  {
    title: t('Type'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Value'),
    classList: `${grid['col-xs-2']} ${grid['col-md-2']}`,
  },
  {
    title: t('Date'),
    classList: `${grid['col-xs-1']} ${grid['col-md-2']}`,
  },
  {
    title: t('Height'),
    classList: grid['col-xs-2'],
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
