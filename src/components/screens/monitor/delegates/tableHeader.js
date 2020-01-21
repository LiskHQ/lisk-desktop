import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './delegates.css';

export default (activeTab, changeSort, t) => ([
  {
    title: t('Rank'),
    classList: grid['col-md-1'],
    sort: {
      fn: changeSort,
      key: 'rank',
    },
  },
  {
    title: t('Name'),
    classList: grid['col-md-2'],
  },
  {
    title: t('Address'),
    classList: activeTab === 'active'
      ? grid['col-md-3']
      : `${grid['col-xs-5']} ${grid['col-md-6']}`,
  },
  {
    title: t('Forging time'),
    classList: activeTab === 'active' ? grid['col-md-2'] : 'hidden',
    tooltip: {
      title: t('Forging time'),
      message: t('Time until next forging slot of a delegate.'),
    },
  },
  {
    title: t('Status'),
    classList: activeTab === 'active'
      ? `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.statusTitle}`
      : 'hidden',
    tooltip: {
      title: t('Status'),
      message: t('Current status of a delegate: forging, not forging, awaiting slot or missed block.'),
    },
  },
  {
    title: t('Productivity'),
    classList: `${grid['col-xs-2']} ${grid['col-md-2']} ${grid['col-lg-2']}`,
    tooltip: {
      title: t('Productivity'),
      message: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      position: 'showOnLeft',
    },
  },
  {
    title: t('Approval'),
    classList: `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.approvalTitle}`,
    tooltip: {
      title: t('Approval'),
      message: t('Percentage of total supply voting for a delegate.'),
      position: 'showOnLeft',
    },
  },
]);
