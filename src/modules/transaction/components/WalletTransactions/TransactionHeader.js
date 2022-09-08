import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './TransactionList.css';

export default (t, activeToken, changeSort) => ([
  {
    title: t('Transaction'),
    classList: `${grid['col-xs-4']} ${styles.transactionTitle}`,
    placeholder: 'circle',
  },
  {
    title: t('Date'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'timestamp',
    },
  },
  {
    title: t('Transaction fee'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Details'),
    classList: `${grid['col-xs-2']} ${grid['col-md-2']}`,
  },
  {
    title: t('Amount'),
    classList: grid['col-xs-2'],
  },
]);
