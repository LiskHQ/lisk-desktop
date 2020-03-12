import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (changeSort, t) => ([
  {
    title: t('IP address'),
    classList: grid['col-md-3'],
  },
  {
    title: t('WS'),
    classList: grid['col-md-2'],
  },
  {
    title: t('Country'),
    classList: grid['col-md-2'],
  },
  {
    title: t('Version'),
    classList: grid['col-md-2'],
    sort: {
      fn: changeSort,
      key: 'version',
    },
  },
  {
    title: t('Height'),
    classList: grid['col-md-3'],
    sort: {
      fn: changeSort,
      key: 'height',
    },
  },
]);
