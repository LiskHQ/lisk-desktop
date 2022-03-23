import React from 'react';
import { NavLink } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { DEFAULT_STANDBY_THRESHOLD, routes } from '@common/configuration';
import { useTheme } from '@common/utilities/theme';
import { capitalize } from '@common/utilities/helpers';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import LiskAmount from '@shared/liskAmount';
import DialogLink from '@basics/dialog/link';
import Icon from '@basics/icon';
import styles from './delegateProfile.css';

export const getStatus = (data) => {
  if (data.status) {
    return data.status.replace('non-eligible', 'ineligible');
  }
  if (data.voteWeight >= DEFAULT_STANDBY_THRESHOLD) {
    return 'standby';
  }
  return 'ineligible';
};

const Item = ({
  icon, title, children,
}) => {
  const theme = useTheme();

  return (
    <BoxContent className={`${styles.highlight} performance`}>
      <div className={`${styles.content} ${styles[icon]}`}>
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
  icon, title, children, theme,
}) => (
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

const ActiveDelegate = ({ theme, t }) => (
  <div className={`${styles.delegateDescription} ${theme}`}>
    <p>
      {t('This delegate is among the first 101 delegates by delegate weight.')}
    </p>

    <p>
      {t('Active delegates are select to generate blocks every round.')}
    </p>
  </div>
);

const StandByDelegate = ({ theme, t }) => (
  <div className={`${styles.delegateDescription} ${theme}`}>
    <p>
      {t(`The delegate has at least 1,000 LSK delegate weight, but is not among the
      top 101 by delegate weight.`)}
    </p>
    <p>
      {
        t('Standby delegates can be chosen at random for one of two slots per round for generating a block.')
      }
    </p>
  </div>
);

const IneligibleDelegate = ({ theme, t }) => (
  <div className={`${styles.delegateDescription} ${theme}`}>
    <p>
      {t('The delegate weight is below 1,000 LSK meaning that the delegate is not eligible to forge.')}
    </p>
  </div>
);

const PunishedDelegate = ({ theme, t }) => (
  <div className={`${styles.delegateDescription} ${theme}`}>
    <p>
      {t('The delegate is temporarily punished and their delegate weight is set to 0 due to a misbehavior.')}
    </p>
    <DialogLink
      className={grid.row}
      component="delegatePerformance"
      data={{ status: 'punished' }}
    >
      <div className={`${styles.details} ${grid.col} ${grid['col-md-12']}`}><p>Details &gt;</p></div>
    </DialogLink>
  </div>
);

const BannedDelegate = ({ theme, t }) => (
  <div className={`${styles.delegateDescription} ${theme}`}>
    <p>
      {t('The delegate is permanently banned from generating blocks due to repeated protocol violations or missing too many blocks.')}
    </p>
  </div>
);

const getDelegateIcon = (status) =>
  `delegate${capitalize(status)}`;

const getDelegateComponent = (status) => {
  const components = {
    active: ActiveDelegate,
    standby: StandByDelegate,
    ineligible: IneligibleDelegate,
    punished: PunishedDelegate,
    banned: BannedDelegate,
  };
  return components[status];
};

const PerformanceView = ({
  t, data,
}) => {
  const theme = useTheme();
  const status = getStatus(data);
  const DelegateComponent = getDelegateComponent(status);

  return (
    <Box className={`${grid['col-xs-12']} ${grid['col-md-9']} ${styles.highlightContainer} performance-container`}>
      <BoxHeader>
        <h1 className={styles.heading}>{t('Performance')}</h1>
      </BoxHeader>
      <Box className={`${grid.row} ${styles.content}`}>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <FullItem
            theme={theme}
            title={t('Status')}
            icon={getDelegateIcon(status)}
          >
            <div className={styles.performanceValue}>{capitalize(status)}</div>
            <DelegateComponent theme={theme} t={t} />
          </FullItem>
        </Box>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <Item
            title={t('Last forged block')}
            icon="productivity"
          >
            { data.lastForgedHeight ? (
              <NavLink
                to={`${routes.block.path}?height=${data.lastForgedHeight}`}
                className={styles.performanceValue}
                id={data.lastForgedHeight}
                exact
              >
                {data.lastForgedHeight}
              </NavLink>
            ) : (
              <span className={styles.performanceValue}>-</span>
            )}
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
