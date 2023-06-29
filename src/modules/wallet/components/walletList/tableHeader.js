import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t, changeSort) => [
  {
    title: t('Address'),
    classList: `${grid['col-xs-4']} ${grid['col-md-6']}`,
  },
  {
    title: t('Balance'),
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
    sort: {
      fn: changeSort,
      key: 'balance',
    },
  },
  {
    title: t('Supply'),
    classList: `${grid['col-xs-1']} ${grid['col-md-1']}`,
    sort: {
      fn: changeSort,
      key: 'balance',
    },
  },
  {
    title: t('Owner'),
    classList: `${grid['col-xs-4']} ${grid['col-md-3']}`,
  },
];
