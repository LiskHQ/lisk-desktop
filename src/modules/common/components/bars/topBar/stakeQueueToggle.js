/* istanbul ignore file */
import React from 'react';
import Tooltip from 'src/theme/Tooltip';
import DialogLink from 'src/theme/dialog/link';
import Icon from 'src/theme/Icon';
import styles from 'src/modules/common/components/bars/topBar/topBar.css';

const StakeQueueToggle = ({ t, stakeCount, disabled }) => (
  <Tooltip
    className={styles.tooltipWrapper}
    size="maxContent"
    position="bottom"
    content={
      <DialogLink
        component="stakingQueue"
        className={`${styles.toggle} staking-queue-toggle ${
          disabled && `${styles.disabled} disabled`
        }`}
      >
        <Icon name="stakingQueueInactive" />
        {stakeCount !== 0 && <span className={styles.stakeCount}>{stakeCount}</span>}
      </DialogLink>
    }
  >
    <p>{t('Staking queue')}</p>
  </Tooltip>
);

export default StakeQueueToggle;
