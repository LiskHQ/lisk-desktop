/* eslint-disable no-nested-ternary */
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegatesMonitorView/delegates.css';

export const getStatusClass = (activeTab) => {
  switch (activeTab) {
    case 'active':
      return 'hidden';
    case 'sanctioned':
      return grid['col-xs-7'];
    case 'watched':
    case 'standby':
      return grid['col-xs-2'];
    default:
      return grid['col-xs-4'];
  }
};

export const getDelegateWeightClass = (activeTab) => {
  switch (activeTab) {
    case 'sanctioned':
      return 'hidden';
    case 'watched':
      return `${grid['col-xs-2']} ${styles.voteWeight}`;
    default:
      return `${grid['col-xs-3']} ${styles.voteWeight}`;
  }
};

export const getDelegateRankClass = (activeTab) => {
  switch (activeTab) {
    case 'active':
    case 'watched':
      return `${grid['col-xs-1']} ${styles.rank}`;
    case 'standby':
      return `${grid['col-xs-2']} ${styles.rank}`;
    default:
      return 'hidden';
  }
};

export const getRoundStateClass = (activeTab) => {
  switch (activeTab) {
    case 'active':
      return `${grid['col-xs-1']} ${styles.statusTitle} text-right ${styles.roundStateHeader}`;
    case 'watched':
      return `${grid['col-xs-1']} ${styles.statusTitle} ${styles.roundStateHeader}`;
    default:
      return 'hidden';
  }
};

export const getForgingTimeClass = (activeTab) => {
  switch (activeTab) {
    case 'active':
      return grid['col-xs-2'];
    case 'watched':
      return grid['col-xs-2'];
    default:
      return 'hidden';
  }
};

export const getDelegateDetailsClass = (activeTab) => {
  switch (activeTab) {
    case 'watched':
      return `${grid['col-xs-4']} ${styles.delegateHeader}`;
    default:
      return `${grid['col-xs-5']} ${styles.delegateHeader}`;
  }
};

// eslint-disable-next-line complexity
export default (activeTab, changeSort, t) => ([
  {
    title: t('Delegate'),
    classList: getDelegateDetailsClass(activeTab),
  },
  {
    title: t('Delegate weight'),
    classList: getDelegateWeightClass(activeTab),
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total amount of votes received for a delegate.'),
      position: 'top',
    },
  },
  {
    title: t('Rank'),
    classList: getDelegateRankClass(activeTab),
  },
  {
    title: t('Forging time'),
    classList: getForgingTimeClass(activeTab),
    sort: {
      fn: changeSort,
      key: 'forgingTime',
    },
  },
  {
    title: t('Round state'),
    classList: getRoundStateClass(activeTab),
  },
  {
    title: t('Status'),
    classList: getStatusClass(activeTab),
    sort: {
      fn: changeSort,
      key: activeTab === 'sanctioned' ? 'sanctionedStatus' : 'status',
    },
  },
]);
