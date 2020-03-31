import grid from 'flexboxgrid/dist/flexboxgrid.css';

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
    classList: grid['col-md-2'],
  },
  {
    title: t('Votes'),
    classList: grid['col-md-3'],
  },
]);
