import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votes.css';

export default t => ([
  {
    title: t('Delegate'),
    classList: grid['col-sm-5'],
  },
  {
    title: t('Rank'),
    classList: grid['col-sm-2'],
  },
  {
    title: t('Delegate weight'),
    classList: grid['col-sm-2'],
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total amount of all votes a delegate has received.'),
      position: 'bottom',
    },
  },
  {
    title: t('Vote amount'),
    classList: `${grid['col-sm-2']} ${styles.flexRightAlign}`,
    tooltip: {
      title: t('Vote amount'),
      message: t('The amount of LSK blocked for voting.'),
      position: 'left',
    },
  },
  {
    title: t(''),
    classList: grid['col-sm-1'],
  },
]);
