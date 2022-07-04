import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Sender'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Date'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Votes'),
    classList: grid['col-xs-4'],
  },
]);
