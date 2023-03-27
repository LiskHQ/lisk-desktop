import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './BlockDetailsTransactionsTable.css';

export default (t) => [
  {
    title: t('ID'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Sender'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Height'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Type'),
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
  },
  {
    title: t('Date'),
    classList: `${grid['col-md-2']} ${styles.transactionFeeCell}`,
  },
  {
    title: t('Status'),
    classList: grid['col-xs-1'],
  },
];
