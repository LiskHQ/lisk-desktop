import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@utils/theme';
import { routes } from '@constants';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import LiskAmount from '@shared/liskAmount';
import Icon from '@toolbox/icon';
import styles from './delegateProfile.css';

const Item = ({
  icon, title, children,
}) => {
  const theme = useTheme();

  return (
    <BoxContent className={`${styles.highlight} performance`}>
      <div className={styles.content}>
        <div className={`${styles.title} ${theme}`}>{title}</div>
        { children }
      </div>
      <div className={`${styles.highlighIcon} ${styles[icon]}`}>
        <Icon name={icon} />
      </div>
    </BoxContent>
  );
};

const PerformanceView = ({
  t, data,
}) => (
  <Box className={`${grid['col-xs-12']} ${grid['col-md-8']} ${styles.highlightContainer} performance-container`}>
    <BoxHeader>
      <h1 className={styles.heading}>{t('Performance')}</h1>
    </BoxHeader>
    <Box className={`${grid.row} ${styles.content}`}>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          title={t('Productivity')}
          icon="productivity"
        >
          <NavLink
            to={`${routes.block.path}?height=${data.lastForgedHeight}`}
            className={styles.performanceValue}
            id={data.lastForgedHeight}
            exact
          >
            {'99.45%' || '-'}
          </NavLink>
        </Item>
        <Item
          title={t('Forged blocks')}
          icon="forgedBlocks"
        >
          <div className={styles.performanceValue}>{data.producedBlocks ?? '-'}</div>
        </Item>
      </Box>
      <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-6']} ${styles.column}`}>
        <Item
          title={t('Rewards (LSK)')}
          icon="reward"
        >
          <div><LiskAmount val={data.rewards || 0} /></div>
        </Item>
        <Item
          title={t('Consecutive missed blocks')}
          icon="missedBlocks"
        >
          <div className={styles.performanceValue}>{data.consecutiveMissedBlocks}</div>
        </Item>
      </Box>
    </Box>
  </Box>
);

export default PerformanceView;
