import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './BlockDetailsTransactionsTable.css';

export default (t) => ([
  {
    title: t('Sender'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Recipient'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Date'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Amount'),
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
  },
  {
    title: t('Fee'),
    classList: `${grid['col-md-1']} ${styles.transactionFeeCell}`,
  },
  {
    title: t('Status'),
    classList: grid['col-xs-1'],
  },
]);
