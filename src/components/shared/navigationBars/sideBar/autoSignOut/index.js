import React from 'react';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import styles from './autoSignOut.css';

const TimeOutToast = ({ t, history, ...props }) => {
  const minutes = parseInt(props.minutes, 10);
  const seconds = parseInt(props.seconds, 10);

  const renderToast = minutes === 0 && seconds === 1;

  /* istanbul ignore next */
  return (
    renderToast && toast(
      <div className={styles.toastText}>{t('Session timeout')}</div>, {
        autoClose: false,
        closeButton: <span
          className={styles.closeBtn}
        />,
      },
    )
  );
};

const AutoSignOut = ({
  t,
  expireTime,
  onCountdownComplete,
}) => (
  <Countdown
    date={expireTime}
    onComplete={onCountdownComplete}
    renderer={
      ({ minutes, seconds }) => <TimeOutToast t={t} minutes={minutes} seconds={seconds} />
    }
  />
);

export default withTranslation()(AutoSignOut);
