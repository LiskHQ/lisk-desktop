import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '@token/configuration/tokens';
import styles from './ExplorerTransactions.css';

export default (t, activeToken, changeSort) => {
  const isLSK = activeToken === tokenMap.LSK.key;
  return ([
    {
      title: t('Transaction'),
      classList: isLSK
        ? `${grid['col-xs-4']} ${styles.transactionTitle}`
        : `${grid['col-xs-5']} ${styles.transactionTitle}`,
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
      classList: isLSK ? `${grid['col-xs-2']} ${grid['col-md-2']}` : 'hidden',
    },
    {
      title: t('Amount'),
      classList: grid[isLSK ? 'col-xs-2' : 'col-xs-3'],
    },
  ]);
};
