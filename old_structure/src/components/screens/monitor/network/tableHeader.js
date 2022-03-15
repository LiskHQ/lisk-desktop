import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './network.css';

export default (changeSort, t) => ([
  {
    title: t('IP address'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Port'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Country'),
    classList: grid['col-xs-2'],
    tooltip: {
      title: t('Country'),
      message: () => (
        <p>
          <span>
            Lisk Desktop determines the country names using
            GeoLite2 data created by
          </span>
          &nbsp;
          <a href="http://www.maxmind.com">Maxmind</a>
          .
        </p>
      ),
      position: 'bottom',
    },
  },
  {
    title: t('Version'),
    classList: grid['col-xs-2'],
    sort: {
      fn: changeSort,
      key: 'networkVersion',
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
