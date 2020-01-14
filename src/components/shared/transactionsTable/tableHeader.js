import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default changeSort => ([
  {
    title: 'Sender',
    classList: grid['col-xs-3'],
  },
  {
    title: 'Recipient',
    classList: grid['col-xs-3'],
  },
  {
    title: 'Date',
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'timestamp',
    },
  },
  {
    title: 'Amount',
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'amount',
    },
  },
  {
    title: 'Fee',
    classList: grid['col-xs-1'],
  },
  {
    title: 'Status',
    classList: grid['col-xs-1'],
  },
]);
