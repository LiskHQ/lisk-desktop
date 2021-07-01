import React from 'react';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import styles from './autoSignOut.css';

const TimeOutToast = ({ t, completed }) => (
  completed && toast(
    <div className={styles.toastText}>{t('Session timeout')}</div>, {
      toastId: 'time-out',
      autoClose: false,
      closeButton: <span
        className={styles.closeBtn}
      />,
    },
  )
);

const AutoSignOut = ({
  t,
  expireTime,
  onCountdownComplete,
}) => (
  <Countdown
    date={expireTime}
    onComplete={onCountdownComplete}
    renderer={
      ({ completed }) => <TimeOutToast t={t} completed={completed} />
    }
  />
);

export default withTranslation()(AutoSignOut);
