import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './network.css';

export default (changeSort, t) => ([
  {
    title: t('IP address'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('WS'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Country'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Version'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'version',
    },
  },
  {
    title: t('Height'),
    classList: `${grid['col-xs-3']} ${styles.height}`,
    sort: {
      fn: changeSort,
      key: 'height',
    },
  },
]);
