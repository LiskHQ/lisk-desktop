import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Delegate'),
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
    title: t('Votes'),
    classList: grid['col-xs-4'],
  },
]);
