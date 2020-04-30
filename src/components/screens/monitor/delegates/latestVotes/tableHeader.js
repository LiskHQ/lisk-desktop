import grid from 'flexboxgrid/dist/flexboxgrid.css';
import gridVisibility from 'flexboxgrid-helpers/dist/flexboxgrid-helpers.min.css';
import styles from '../delegates.css';

export default t => ([
  {
    title: t('Sender'),
    classList: grid['col-sm-3'],
  },
  {
    title: t('Date'),
    classList: grid['col-sm-2'],
  },
  {
    title: t('Current balance'),
    classList: grid['col-sm-2'],
  },
  {
    title: t('Round'),
    classList: `${grid['col-lg-1']} ${gridVisibility['hidden-md']} ${gridVisibility['hidden-sm']} ${gridVisibility['hidden-xs']}`,
  },
  {
    title: t('Votes'),
    classList: `${grid['col-sm-5']} ${grid['col-lg-4']} ${styles.votesColumnTitle}`,
  },
]);
