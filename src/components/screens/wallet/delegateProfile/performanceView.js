import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './delegateProfile.css';
import Icon from '../../../toolbox/icon';

const Item = ({ icon, className }) => (
  <BoxContent className={`${styles.performance} performance`}>
    <div className={styles.performanceText}>
      <div>Performance</div>
      <div>value</div>
    </div>
    <div className={className}>
      <Icon name={icon} />
    </div>
  </BoxContent>
);

const PerformanceView = ({ t: t = str => str }) => (
  <Box className={`${grid['col-xs-6']} ${grid['col-md-8']} ${grid['col-lg-8']} ${styles.performanceContainer} performance-container`}>
    <BoxHeader>
      <h1>{t('Performance')}</h1>
    </BoxHeader>
    <Box className={`${grid.row}`}>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-4']} ${grid['col-lg-6']} ${styles.column}`}>
        <Item icon="productivity" className={`${styles.performanceIcon} ${styles.productivityIcon}`} />
        <Item icon="forgedBlocks" className={`${styles.performanceIcon} ${styles.forgedBlocksIcon}`} />
      </Box>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-4']} ${grid['col-lg-6']} ${styles.column}`}>
        <Item icon="missedBlocks" className={`${styles.performanceIcon} ${styles.missedBlocksIcon}`} />
        <Item icon="forgedLsk" className={`${styles.performanceIcon} ${styles.forgedLskIcon}`} />
      </Box>
    </Box>
  </Box>
);

export default PerformanceView;
