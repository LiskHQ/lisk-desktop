import grid from 'flexboxgrid/dist/flexboxgrid.css';
import gridVisibility from 'flexboxgrid-helpers/dist/flexboxgrid-helpers.min.css';

export default t => ([
  {
    title: t('Sender'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Date'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Round'),
    classList: `${grid['col-lg-2']} ${gridVisibility['hidden-md']} ${gridVisibility['hidden-sm']} ${gridVisibility['hidden-xs']}`,
  },
  {
    title: t('Votes'),
    classList: `${grid['col-xs-5']} ${grid['col-lg-3']}`,
  },
]);
