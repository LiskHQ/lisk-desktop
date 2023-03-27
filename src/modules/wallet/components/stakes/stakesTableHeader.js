import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './stakes.css';

export default (t) => [
  {
    title: t('Validator'),
    classList: grid['col-sm-5'],
  },
  {
    title: t('Rank'),
    classList: grid['col-sm-2'],
  },
  {
    title: t('Validator weight'),
    classList: grid['col-sm-2'],
    tooltip: {
      title: t('Validator weight'),
      message: t('The total amount of stakes received for a validator.'),
      position: 'bottom',
    },
  },
  {
    title: t('Stake amount'),
    classList: `${grid['col-sm-2']} ${styles.flexRightAlign}`,
    tooltip: {
      title: t('Stake amount'),
      message: t('The total amount of stakes received from this account.'),
      position: 'left',
    },
  },
  {
    title: t(''),
    classList: grid['col-sm-1'],
  },
];
