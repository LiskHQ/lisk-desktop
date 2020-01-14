import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (changeSort, t) => ([
  {
    title: t('Sender'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Recipient'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Date'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'timestamp',
    },
  },
  {
    title: t('Amount'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'amount',
    },
  },
  {
    title: t('Fee'),
    classList: grid['col-xs-1'],
  },
  {
    title: t('Status'),
    classList: grid['col-xs-1'],
  },
]);
