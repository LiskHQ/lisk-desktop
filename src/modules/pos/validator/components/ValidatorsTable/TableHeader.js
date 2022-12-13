/* istanbul ignore file */
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../ValidatorsMonitorView/Validators.css';

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

export const getValidatorWeightClass = (activeTab) => {
  switch (activeTab) {
    case 'sanctioned':
      return 'hidden';
    case 'watched':
      return `${grid['col-xs-2']} ${styles.voteWeight}`;
    default:
      return `${grid['col-xs-3']} ${styles.voteWeight}`;
  }
};

export const getValidatorRankClass = (activeTab) => {
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

export const getValidatorDetailsClass = (activeTab) => {
  switch (activeTab) {
    case 'watched':
      return `${grid['col-xs-4']} ${styles.validatorHeader}`;
    default:
      return `${grid['col-xs-5']} ${styles.validatorHeader}`;
  }
};

// eslint-disable-next-line complexity
export default (activeTab, changeSort, t) => [
  {
    title: t('Validator'),
    classList: getValidatorDetailsClass(activeTab),
  },
  {
    title: t('Validator weight'),
    classList: getValidatorWeightClass(activeTab),
    tooltip: {
      title: t('Validator weight'),
      message: t('The total amount of votes received for a validator.'),
      position: 'top',
    },
  },
  {
    title: t('Rank'),
    classList: getValidatorRankClass(activeTab),
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
];
