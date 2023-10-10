import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from 'src/routes/routes';
import { useTheme } from '@theme/Theme';
import { capitalize } from 'src/utils/helpers';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import FormattedNumber from '@common/components/FormattedNumber/FormattedNumber';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import DialogLink from '@theme/dialog/link';
import Tooltip from 'src/theme/Tooltip/tooltip';
import Icon from '@theme/Icon';
import styles from './ValidatorProfile.css';
import usePosToken from '../../hooks/usePosToken';

const Item = ({ icon, title, children }) => {
  const theme = useTheme();

  return (
    <BoxContent className={`${styles.highlight} performance`}>
      <div className={`${styles.content} ${styles[icon]}`}>
        <div className={`${styles.title} ${theme}`}>{title}</div>
        {children}
      </div>
      <div className={`${styles.highlightIcon} ${styles[icon]}`}>
        <Icon name={icon} />
      </div>
    </BoxContent>
  );
};

const FullItem = ({ status, title, children, theme }) => (
  <BoxContent className={`${styles.full} performance`}>
    <div className={styles.content}>
      <div className={`${styles.title} ${theme}`}>{title}</div>
      {children}
    </div>
    <div className={`${styles.highlightIcon}`}>
      {status && <Icon name={`validator${capitalize(status) || 'Standby'}`} />}
    </div>
  </BoxContent>
);

const ActiveValidator = ({ theme, t }) => (
  <div className={`${styles.validatorDescription} ${theme}`}>
    <p>{t('This validator is among the first 101 validators by validator weight.')}</p>

    <p>{t('Active validators are selected to generate blocks every round.')}</p>
  </div>
);

const StandByValidator = ({ theme, t }) => (
  <div className={`${styles.validatorDescription} ${theme}`}>
    <p>
      {t(`The validator has at least 1,000 LSK validator weight, but is not among the
      top 101 by validator weight.`)}
    </p>
    <p>
      {t(
        'Standby validators can be chosen at random for one of two slots per round for generating a block.'
      )}
    </p>
  </div>
);

const IneligibleValidator = ({ theme, t }) => (
  <div className={`${styles.validatorDescription} ${theme}`}>
    <p>
      {t(
        'The validator weight is below 1,000 LSK meaning that the validator is not eligible to generate.'
      )}
    </p>
  </div>
);

const PunishedValidator = ({ theme, t }) => (
  <div className={`${styles.validatorDescription} ${theme}`}>
    <p>
      {t(
        'The validator is temporarily punished and their validator weight is set to 0 due to a misbehavior.'
      )}
    </p>
    <DialogLink className={grid.row} component="validatorPerformance" data={{ status: 'punished' }}>
      <div className={`${styles.details} ${grid.col} ${grid['col-md-12']}`}>
        <p>{t('Details ')}&gt;</p>
      </div>
    </DialogLink>
  </div>
);

const BannedValidator = ({ theme, t }) => (
  <div className={`${styles.validatorDescription} ${theme}`}>
    <p>
      {t(
        'The validator is permanently banned from generating blocks due to repeated protocol violations or missing too many blocks.'
      )}
    </p>
  </div>
);

const getValidatorComponent = (status) => {
  const components = {
    active: ActiveValidator,
    standby: StandByValidator,
    ineligible: IneligibleValidator,
    punished: PunishedValidator,
    banned: BannedValidator,
  };
  return components[status];
};

const PerformanceView = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const status = data?.status || '';
  const ValidatorComponent = status.length ? getValidatorComponent(status) : () => null;
  const { token } = usePosToken();
  const rewardValue = convertFromBaseDenom(data?.earnedRewards, token);
  const selfStakeRewardValue = convertFromBaseDenom(data?.totalSelfStakeRewards, token);
  const commissionRewardValue = convertFromBaseDenom(data?.totalCommission, token);

  return (
    <Box
      className={`${grid['col-xs-12']} ${grid['col-md-9']} ${styles.highlightContainer} performance-container`}
    >
      <BoxHeader>
        <h1 className={styles.heading}>{t('Performance')}</h1>
      </BoxHeader>
      <Box className={`${grid.row} ${styles.content}`}>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <FullItem theme={theme} title={t('Status')} status={status}>
            <div className={styles.performanceValue}>{capitalize(status)}</div>
            <ValidatorComponent theme={theme} t={t} />
          </FullItem>
        </Box>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <Item title={t('Last generated block height')} icon="productivity">
            {data?.lastGeneratedHeight && data?.generatedBlocks > 0 ? (
              <NavLink
                to={`${routes.block.path}?height=${data.lastGeneratedHeight}`}
                className={styles.performanceValue}
                id={data.lastGeneratedHeight}
                exact
              >
                {data.lastGeneratedHeight}
              </NavLink>
            ) : (
              <span className={styles.performanceValue}>-</span>
            )}
          </Item>
          <Item title={t('Blocks generated')} icon="generatedBlocks">
            <div className={styles.performanceValue}>{data?.producedBlocks ?? '-'}</div>
          </Item>
        </Box>
        <Box className={`${grid.col} ${grid['col-xs-4']} ${grid['col-md-4']} ${styles.column}`}>
          <BoxContent className={`${styles.highlight} ${styles.rewardWrapper} performance`}>
            <div className={`${styles.content} ${styles.reward}`}>
              <div className={`${styles.title} ${theme}`}>
                <div className={`${grid.row} ${styles.rewardContainer}`}>
                  <div className={grid['col-md-6']}>
                    <span>{t(`Rewards (${token?.symbol ?? 'LSK'})`)}</span>
                    <div className={styles.performanceValue}>
                      <FormattedNumber val={Number(rewardValue || 0).toFixed(4)} />
                    </div>
                    <div className={styles.separator} />
                  </div>
                  <div className={`${grid['col-md-6']} ${styles.highlightIcon}`}>
                    <Icon name="reward" />
                  </div>
                </div>
              </div>
              <div className={styles.details}>
                <span>{t('Self stake')}</span>
                <Tooltip position="top" tooltipClassName={styles.tooltipDetails}>
                  <span>{t('Total rewards earned based on number of blocks generated.')}</span>
                </Tooltip>
                &nbsp;&nbsp;
                <span className={styles.value}>
                  <FormattedNumber val={Number(selfStakeRewardValue || 0).toFixed(4)} />
                </span>
              </div>
              <div className={styles.details}>
                <span>{t('Commission')}</span>
                <Tooltip position="top" tooltipClassName={styles.tooltipDetails}>
                  <span>
                    {t(
                      'Total rewards earned by the validator as commission for generating blocks.'
                    )}
                  </span>
                </Tooltip>
                &nbsp;&nbsp;
                <span className={styles.value}>
                  <FormattedNumber val={Number(commissionRewardValue || 0).toFixed(4)} />
                </span>
              </div>
            </div>
          </BoxContent>
          <Item title={t('Consecutive missed blocks')} icon="consecutiveMissedBlocks">
            <div className={styles.performanceValue}>{data?.consecutiveMissedBlocks}</div>
          </Item>
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceView;
