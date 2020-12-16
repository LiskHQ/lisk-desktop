import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './delegateProfile.css';
import Icon from '../../../toolbox/icon';

const Item = ({
  icon, className, text, value,
}) => (
  <BoxContent className={`${styles.performance} performance`}>
    <div className={styles.performanceContent}>
      <div className={styles.performanceText}>{text}</div>
      <div className={styles.performanceValue}>{value}</div>
    </div>
    <div className={className}>
      <Icon name={icon} />
    </div>
  </BoxContent>
);

const PerformanceView = ({
  t, productivity, forgedBlocks, forgedLsk, missedBlocks,
}) => (
  <Box className={`${grid['col-xs-12']} ${grid['col-md-8']} ${styles.performanceContainer} performance-container`}>
    <BoxHeader>
      <h1 className={styles.heading}>{t('Performance')}</h1>
    </BoxHeader>
    <Box className={`${grid.row} ${styles.content}`}>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          text={t('Productivity')}
          value={productivity}
          icon="productivity"
          className={`${styles.performanceIcon} ${styles.productivityIcon}`}
        />
        <Item
          text={t('Forged Blocks')}
          value={forgedBlocks}
          icon="forgedBlocks"
          className={`${styles.performanceIcon} ${styles.forgedBlocksIcon}`}
        />
      </Box>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          text={t('Missed Blocks')}
          value={missedBlocks}
          icon="missedBlocks"
          className={`${styles.performanceIcon} ${styles.missedBlocksIcon}`}
        />
        {forgedLsk && (
          <Item
            text={t('Forged LSK')}
            value={forgedLsk}
            icon="forgedLsk"
            className={`${styles.performanceIcon} ${styles.forgedLskIcon}`}
          />
        )}
      </Box>
    </Box>
  </Box>
);

export default PerformanceView;
