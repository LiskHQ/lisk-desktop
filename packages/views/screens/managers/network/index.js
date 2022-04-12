import React from 'react';
import { withTranslation } from "react-i18next";
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import Tooltip from '@basics/tooltip/tooltip';
import styles from './network.css';
import NodesList from './nodesList/manager';
import Statistics from './statistics';


export const Network = ({
  t,
}) => (
  <div>
    <Statistics />
    <Box className="map-box">
      <BoxHeader>
        <div>
          <h1 className={`${styles.contentHeader} contentHeader`}>
            {t('Connected peers')}
          </h1>
          <Tooltip position="right">
            <p>{t('The list shown only contains peers connected to the current Lisk Service node.')}</p>
          </Tooltip>
        </div>
      </BoxHeader>
    </Box>
    <NodesList />
  </div>
);

export default withTranslation()(Network);
