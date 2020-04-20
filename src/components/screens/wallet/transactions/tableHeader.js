import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Transaction'),
    classList: `${grid['col-xs-5']} ${grid['col-md-4']}`,
  },
  {
    title: t('Date'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Fee'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Details'),
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
  },
  {
    title: t('Amount'),
    classList: grid['col-xs-2'],
  },
]);
