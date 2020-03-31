import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../delegates.css';

export default t => ([
  {
    title: t('Sender'),
    classList: grid['col-md-3'],
  },
  {
    title: t('Date'),
    classList: grid['col-md-2'],
  },
  {
    title: t('Current balance'),
    classList: grid['col-md-2'],
  },
  {
    title: t('Round'),
    classList: grid['col-md-1'],
  },
  {
    title: t('Votes'),
    classList: `${grid['col-md-4']} ${styles.votesColumnTitle}`,
  },
]);
