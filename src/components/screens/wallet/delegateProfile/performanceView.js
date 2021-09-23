import React, { createContext } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@utils/theme';
import { routes } from '@constants';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import LiskAmount from '@shared/liskAmount';
import DialogLink from '@toolbox/dialog/link';
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
        {children}
      </div>
      <div className={`${styles.highlighIcon} ${styles[icon]}`}>
        <Icon name={icon} />
      </div>
    </BoxContent>
  );
};

const FullItem = ({
  icon, title, children,
}) => {
  const theme = useTheme();

  return (
    <BoxContent className={`${styles.full} performance`}>
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

const ActiveDelegate = () => {
  const theme = useTheme();

  return (
    <div className={`${styles.delegateDescription} ${theme}`}>
      <p>This delegate is among the first 101 delegates in delegate weight ranking.</p>

      <p>The first 101 delegates will always be selected to forge new blocks.</p>
    </div>
  );
};

const StandyDelegate = () => {
  const theme = useTheme();

  return (
    <div className={`${styles.delegateDescription} ${theme}`}>
      <p>
        The delegate weight is at least 1,000 LSK meaning that the delegate can be chosen
        for one of the two randomly assigned slots for standby delegates.
      </p>
    </div>
  );
};

const detailsData = {
  // eslint-disable-next-line no-multi-str
  reason: 'This delegate was punished 3 times. Two more  punishments will cause the permanent ban of the delegate.',
  data: [
    { startHeight: 10273851, endHeight: 10273872 },
    { startHeight: 10058635, endHeight: 10278851 },
    { startHeight: 10273951, endHeight: 10274851 },
  ],
};

// Use context to pass data into modal
export const DelegatePerformanceContext = createContext({
  performance: detailsData,
});

const PunishedDelegate = () => {
  const theme = useTheme();

  return (
    <div className={`${styles.delegateDescription} ${theme}`}>
      <p>This delegate can not forge new blocks temporarily due to a protocol violation.</p>
      <DialogLink
        className={grid.row}
        component="delegatePerformance"
        data={{ status: 'punished' }}
      >
        <div className={`${styles.details} ${grid.col} ${grid['col-md-12']}`}><p>Details &gt;</p></div>
      </DialogLink>
    </div>
  );
};

const BannedDelegate = () => {
  const theme = useTheme();

  return (
    <div className={`${styles.delegateDescription} ${theme}`}>
      <p>This delegate is permanently banned from forging new blocks.</p>
    </div>
  );
};

const getDelegateIcon = (status) => {
  const capitalizedStatus = `${status[0].toUpperCase()}${status.slice(1)}`;
  return `delegate${capitalizedStatus}`;
};

const getDelegateComponent = (status) => {
  const components = {
    active: ActiveDelegate,
    standby: StandyDelegate,
    punished: PunishedDelegate,
    banned: BannedDelegate,
  };
  return components[status];
};

const PerformanceView = ({
  t, data,
}) => {
  const DelegateComponent = getDelegateComponent(data.status);
  return (
    <Box className={`${grid['col-xs-12']} ${grid['col-md-9']} ${styles.highlightContainer} performance-container`}>
      <BoxHeader>
        <h1 className={styles.heading}>{t('Performance')}</h1>
      </BoxHeader>
      <Box className={`${grid.row} ${styles.content}`}>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <FullItem
            title={t('Status')}
            icon={getDelegateIcon(data.status ?? 'default')}
          >
            <div className={styles.performanceValue}>{data.status ? `${data.status[0].toUpperCase()}${data.status.slice(1)}` : '-'}</div>
            <DelegateComponent />
          </FullItem>
        </Box>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
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
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <Item
            title={t('Rewards (LSK)')}
            icon="reward"
          >
            <div><LiskAmount val={data.rewards || 0} /></div>
          </Item>
          <Item
            title={t('Consecutive missed blocks')}
            icon="consecutiveMissedBlocks"
          >
            <div className={styles.performanceValue}>{data.consecutiveMissedBlocks}</div>
          </Item>
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceView;
