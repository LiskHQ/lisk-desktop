import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/routes/routes';
import Tooltip from 'src/theme/Tooltip';
import DialogLink from 'src/theme/dialog/link';
import Icon from 'src/theme/Icon';
import styles from 'src/modules/common/components/bars/topBar/topBar.css';

const SignedInTip = ({ t }) => <p>{t('Voting queue')}</p>;

const SignedOutTip = ({ t }) => (
  <div className={`${styles.signedOutTip} sign-out-tip`}>
    <b>{t('Please sign in')}</b>
    <p>
      {t(
        'In order to use this feature you need to sign in to your Lisk account.',
      )}
    </p>
    <Link to={routes.login.path}>{t('Sign in')}</Link>
  </div>
);

const VoteQueueToggle = ({
  t, noOfVotes, isUserLogout, disabled,
}) => (
  <Tooltip
    className={styles.tooltipWrapper}
    size="maxContent"
    position={isUserLogout ? 'bottom right' : 'bottom'}
    indent={isUserLogout}
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
    {isUserLogout ? <SignedOutTip t={t} /> : <SignedInTip t={t} />}
  </Tooltip>
);

export default VoteQueueToggle;
