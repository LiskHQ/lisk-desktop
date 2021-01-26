import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegates.css';

export default (activeTab, changeSort, t) => ([
  {
    classList: activeTab === 'active' ? `${grid['col-xs-1']}` : 'hidden',
  },
  {
    title: t('Delegate'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Productivity'),
    classList: activeTab === 'active' ? `${grid['col-xs-2']}` : `${grid['col-xs-3']}`,
    tooltip: {
      title: t('Productivity'),
      message: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      position: 'top',
    },
  },
  {
    title: t('Rank'),
    classList: activeTab === 'active' ? `${grid['col-xs-1']}` : `${grid['col-xs-2']}`,
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
      position: 'top',
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
  {
    title: t('Status'),
    classList: activeTab !== 'active'
      ? `${grid['col-xs-2']}`
      : 'hidden',
  },
]);
