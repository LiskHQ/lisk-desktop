import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (changeSort, t) => ([
  {
    title: t('Name'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Chain Id'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Status'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'timestamp',
    },
  },
  {
    title: t('LSK deposited'),
    classList: grid['col-xs-3'],
    sort: {
      fn: changeSort,
      key: 'amount',
    },
  },
]);
