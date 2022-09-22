import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t, changeSort) => [
  {
    title: t('ID'),
    classList: `${grid['col-xs-3']} ${grid['col-md-3']}`,
  },
  {
    title: t('Height'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Type'),
    classList: `${grid['col-xs-4']}`,
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
    title: t('Status'),
    classList: grid['col-xs-1'],
  },
];
