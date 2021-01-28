/* eslint-disable no-nested-ternary */
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegates.css';

// eslint-disable-next-line complexity
export default (activeTab, changeSort, t) => ([
  {
    title: t('Delegate'),
    classList: `${activeTab === 'sanctioned' ? grid['col-xs-4'] : grid['col-xs-3']} ${styles.delegateHeader}`,
  },
  {
    title: t('Productivity'),
    classList: activeTab === 'active' || activeTab === 'watched' ? `${grid['col-xs-2']}` : `${grid['col-xs-3']}`,
    tooltip: {
      title: t('Productivity'),
      message: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      position: 'top',
    },
  },
  {
    title: t('Rank'),
    classList: activeTab === 'sanctioned' ? `${grid['col-xs-3']}` : activeTab === 'watched' ? `${grid['col-xs-1']}` : `${grid['col-xs-2']}`,
    sort: {
      fn: changeSort,
      key: 'rank',
    },
  },
  {
    title: t('Delegate weight'),
    classList: activeTab === 'sanctioned' ? 'hidden' : `${grid['col-xs-2']} ${styles.voteWeight}`,
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total LSK voted to a delegate.'),
      position: 'top',
    },
  },
  {
    title: t('Forging time'),
    classList: activeTab === 'active' || activeTab === 'watched' ? `${grid['col-xs-2']}` : 'hidden',
    sort: {
      fn: changeSort,
      key: 'forgingTime',
    },
  },
  {
    title: t('Round state'),
    classList: activeTab === 'active' || activeTab === 'watched'
      ? `${grid['col-xs-1']} ${styles.statusTitle} ${styles.roundStateHeader}`
      : 'hidden',
  },
  {
    title: t('Status'),
    classList: activeTab === 'watched'
      ? `${grid['col-xs-1']}`
      : activeTab !== 'active' ? `${grid['col-xs-2']}` : 'hidden',
  },
]);
