import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './firstTimeVotingOverlay.css';

const FirstTimeVotingOverlay = ({
  children, enabled, t,
}) => (
  <div className={styles.wrapper}>
    {enabled
      ? (
        <div className={styles.selectingDelegatesOverlay}>
          <Tooltip
            styles={{
              infoIcon: styles.infoIcon,
              tooltip: styles.tooltipClass,
            }}
            tooltipClassName={styles.tooltipClassName}
            className={styles.selectingDelegates}
            alwaysShow
            title={t('Selecting Delegates')}
          >
            <p>{t('Start by Selecting the delegates you’d like to vote for.')}</p>
          </Tooltip>
        </div>
      )
      : null}
    {children}
  </div>
);

FirstTimeVotingOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(FirstTimeVotingOverlay);
