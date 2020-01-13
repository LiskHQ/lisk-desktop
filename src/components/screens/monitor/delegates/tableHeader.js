import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './delegates.css';

export default (activeTab, changeSort) => ([
  {
    title: 'Rank',
    classList: grid['col-md-1'],
    sort: () => changeSort('rank'),
  },
  {
    title: 'Name',
    classList: grid['col-md-2'],
  },
  {
    title: 'Address',
    classList: activeTab === 'active'
      ? grid['col-md-3']
      : `${grid['col-xs-5']} ${grid['col-md-6']}`,
  },
  {
    title: 'Forging time',
    classList: activeTab === 'active' ? grid['col-md-2'] : 'hidden',
    tooltip: {
      title: 'Forging time',
      message: 'Time until next forging slot of a delegate.',
    },
  },
  {
    title: 'Status',
    classList: activeTab === 'active'
      ? `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.statusTitle}`
      : 'hidden',
    tooltip: {
      title: 'Status',
      message: 'Current status of a delegate: forging, not forging, awaiting slot or missed block.',
    },
  },
  {
    title: 'Productivity',
    classList: `${grid['col-xs-2']} ${grid['col-md-2']} ${grid['col-lg-2']}`,
    tooltip: {
      title: 'Productivity',
      message: 'Percentage of successfully forged blocks in relation to all blocks (forged and missed).',
    },
  },
  {
    title: 'Approval',
    classList: `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.approvalTitle}`,
    tooltip: {
      title: 'Approval',
      message: 'Percentage of total supply voting for a delegate.',
    },
  },
]);
