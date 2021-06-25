import React from 'react';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { timerReset } from '@actions';
import { account } from '@constants';
import styles from './autoSignOut.css';

const TimeOutToast = ({ t, ...props }) => {
  const dispatch = useDispatch();
  const renderToast = parseInt(props.minutes, 10) === 0 && parseInt(props.seconds, 10) === 1;

  const onResetTime = () => {
    dispatch(timerReset(new Date()));
  };

  const diff = (account.lockDuration - account.warnLockDuration) / 1000;
  console.log(diff);
  const absTime = Math.abs(diff);
  const minutes = absTime / 60 >= 1 ? `${Math.floor(absTime / 60)}m ` : '';
  const seconds = absTime % 60 >= 1 ? `${absTime % 60}s` : '';

  /* istanbul ignore next */
  return (
    renderToast && toast(
      <div className={styles.toastText}>
        <p className={styles.title}>{t('Warning session timeout')}</p>
        <p>{t('Your session will timed out in {{time}} if no network activity occur.', { time: `${minutes}${seconds}` })}</p>
        <button
          className={styles.button}
          onClick={onResetTime}
        >
          {t('Reset time')}
        </button>
      </div>,
      {
        toastId: 'warning-time-out',
        autoClose: false,
        closeButton: <span
          className={styles.closeBtn}
        />,
      },
    )
  );
};

const WarningAutoSignOut = ({
  t,
  warningTime,
}) => (
  <Countdown
    date={warningTime}
    renderer={
      ({ minutes, seconds }) => <TimeOutToast t={t} minutes={minutes} seconds={seconds} />
    }
  />
);

export default withTranslation()(WarningAutoSignOut);
