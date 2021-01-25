import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegates.css';

export default (activeTab, changeSort, t) => ([
  {
    classList: `${grid['col-xs-1']}`,
  },
  {
    title: t('Delegate'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Productivity'),
    classList: `${grid['col-xs-2']}`,
    tooltip: {
      title: t('Productivity'),
      message: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      position: 'left',
    },
  },
  {
    title: t('Rank'),
    classList: `${grid['col-xs-1']}`,
    sort: {
      fn: changeSort,
      key: 'rank',
    },
  },
  {
    title: t('Delegate weight'),
    classList: `${grid['col-xs-2']} ${styles.voteWeight}`,
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total LSK voted to a delegate.'),
      position: 'left',
    },
  },
  {
    title: t('Forging time'),
    classList: activeTab === 'active' ? `${grid['col-xs-2']}` : 'hidden',
    sort: {
      fn: changeSort,
      key: 'forgingTime',
    },
  },
  {
    title: t('Round state'),
    classList: activeTab === 'active'
      ? `${grid['col-xs-1']} ${styles.statusTitle}`
      : 'hidden',
  },
]);
