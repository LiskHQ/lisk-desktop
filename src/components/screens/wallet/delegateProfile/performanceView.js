import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { NavLink } from 'react-router-dom';

import routes from '@src/routes';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import Icon from '@toolbox/icon';
import styles from './delegateProfile.css';

const Item = ({
  icon, className, text, value, isLink,
}) => (
  <BoxContent className={`${styles.performance} performance`}>
    <div className={styles.performanceContent}>
      <div className={styles.performanceText}>{text}</div>
      {
        isLink
          ? (
            <NavLink
              to={`${routes.block.path}?id=${value}`}
              className={styles.performanceValue}
              id={value}
              exact
            >
              {value}
            </NavLink>
          )
          : <div className={styles.performanceValue}>{value}</div>
      }
    </div>
    <div className={className}>
      <Icon name={icon} />
    </div>
  </BoxContent>
);

const PerformanceView = ({
  t, forgedBlocks, lastForgedBlocks, forgedLsk, consecutiveMissedBlocks,
}) => (
  <Box className={`${grid['col-xs-12']} ${grid['col-md-8']} ${styles.performanceContainer} performance-container`}>
    <BoxHeader>
      <h1 className={styles.heading}>{t('Performance')}</h1>
    </BoxHeader>
    <Box className={`${grid.row} ${styles.content}`}>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          text={t('Last Forged Block')}
          icon="productivity"
          value={lastForgedBlocks}
          isLink
          className={`${styles.performanceIcon} ${styles.productivityIcon}`}
        />
        <Item
          text={t('Forged Blocks')}
          value={forgedBlocks || '-'}
          icon="forgedBlocks"
          className={`${styles.performanceIcon} ${styles.forgedBlocksIcon}`}
        />
      </Box>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          text={t('Consecutive Missed Blocks')}
          value={consecutiveMissedBlocks}
          icon="missedBlocks"
          className={`${styles.performanceIcon} ${styles.missedBlocksIcon}`}
        />
        <Item
          text={t('Forged LSK')}
          value={forgedLsk || '-'}
          icon="forgedLsk"
          className={`${styles.performanceIcon} ${styles.forgedLskIcon}`}
        />
      </Box>
    </Box>
  </Box>
);

export default PerformanceView;
