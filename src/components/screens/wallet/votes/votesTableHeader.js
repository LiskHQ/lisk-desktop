import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votes.css';

export default t => ([
  {
    title: t('Rank'),
    classList: 'hidden',
  },
  {
    title: t('Delegate'),
    classList: `${grid['col-sm-3']} ${grid['col-lg-6']}`,
  },
  {
    title: t('Forged'),
    classList: grid['col-sm-2'],
    tooltip: {
      title: t('Forged'),
      message: t('Sum of all LSK awarded to a delegate for each block successfully generated on the blockchain.'),
      position: 'bottom',
    },
  },
  {
    title: t('Productivity'),
    classList: `${grid['col-sm-2']} ${grid['col-lg-2']}`,
    tooltip: {
      title: t('Productivity'),
      message: t('% of successfully forged blocks in relation to total blocks that were available for this particular delegate to forge'),
      position: 'bottom',
    },
  },
  {
    title: t('Vote weight'),
    classList: `${grid['col-sm-4']} ${grid['col-lg-2']} ${styles.lastHeading}`,
    tooltip: {
      title: t('Productivity'),
      message: t('Sum of LSK in all accounts who have voted for this delegate.'),
      position: 'left',
    },
  },
]);
