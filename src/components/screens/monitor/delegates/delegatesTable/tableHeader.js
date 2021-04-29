/* eslint-disable no-nested-ternary */
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegates.css';

export const getStatusClass = (activeTab) => {
  switch (activeTab) {
    case 'active':
      return 'hidden';
    case 'sanctioned':
      return grid['col-xs-7'];
    case 'watched':
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

// eslint-disable-next-line complexity
export default (activeTab, changeSort, t) => ([
  {
    title: t('Delegate'),
    classList: `${grid['col-xs-5']} ${styles.delegateHeader}`,
  },
  {
    title: t('Delegate weight'),
    classList: getDelegateWeightClass(activeTab),
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total LSK voted to a delegate.'),
      position: 'top',
    },
  },
  {
    title: t('Forging time'),
    classList: activeTab === 'active'
      ? `${grid['col-xs-3']}`
      : activeTab === 'watched' ? `${grid['col-xs-2']}`
        : 'hidden',
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
  },
]);
