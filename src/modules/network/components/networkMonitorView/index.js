import React from 'react';
import Box from '@theme/box';
import BoxHeader from '@basics/box/header';
import Tooltip from 'src/theme/Tooltip';
import Peers from '../peers';
import Map from '../map';
import Statistics from '../statistics';
import styles from './network.css';

const Network = ({ t, peers }) => (
  <div>
    <Statistics />
    <Box className="map-box">
      <BoxHeader>
        <div>
          <h1 className={`${styles.contentHeader} contentHeader`}>
            {t('Connected peers')}
          </h1>
          <Tooltip position="right">
            <p>
              {t(
                'The list shown only contains peers connected to the current Lisk Service node.'
              )}
            </p>
          </Tooltip>
        </div>
      </BoxHeader>
    </Box>
    <Map peers={peers.data} t={t} />
    <Peers peers={peers} t={t} />
  </div>
);

export default Network;
