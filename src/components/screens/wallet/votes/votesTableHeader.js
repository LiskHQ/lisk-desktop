import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votes.css';

export default t => ([
  {
    title: t('Delegate'),
    classList: grid['col-sm-3'],
  },
  {
    title: t('Productivity'),
    classList: grid['col-sm-2'],
    tooltip: {
      title: t('Productivity'),
      message: t('% of successfully forged blocks in relation to total blocks that were available for this particular delegate to forge'),
      position: 'bottom',
    },
  },
  {
    title: t('Rank'),
    classList: grid['col-sm-2'],
  },
  {
    title: t('Delegate weight'),
    classList: `${grid['col-sm-2']} ${grid['col-lg-2']}`,
    tooltip: {
      title: t('Delegate weight'),
      message: t('The total amount of all votes a delegate has received.'),
      position: 'bottom',
    },
  },
  {
    title: t('Vote amount'),
    classList: `${grid['col-sm-2']} ${grid['col-lg-2']} ${styles.flexRightAlign}`,
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
