// @todo: this should be re-instated when the issue with lisk-client is fixed
/* istanbul ignore file */
import React from 'react';
import Tooltip from 'src/theme/Tooltip';
import DialogLink from 'src/theme/dialog/link';
import Icon from 'src/theme/Icon';
import styles from 'src/modules/common/components/bars/topBar/topBar.css';

const VoteQueueToggle = ({
  t, noOfVotes, disabled,
}) => (
  <Tooltip
    className={styles.tooltipWrapper}
    size="maxContent"
    position="bottom"
    content={(
      <DialogLink
        component="votingQueue"
        className={`${styles.toggle} voting-queue-toggle ${
          disabled && `${styles.disabled} disabled`
        }`}
      >
        <Icon name="votingQueueInactive" />
        {noOfVotes !== 0 && (
          <span className={styles.votingQueueVoteCount}>{noOfVotes}</span>
        )}
      </DialogLink>
    )}
  >
    <p>{t('Voting queue')}</p>
  </Tooltip>
);

export default VoteQueueToggle;
