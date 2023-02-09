import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Validator'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Date'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Round'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Stakes'),
    classList: grid['col-xs-4'],
  },
]);
