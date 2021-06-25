import React from 'react';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { timerReset } from '@actions';
import { account } from '@constants';
import styles from './autoSignOut.css';

const getWarningTime = (expireTime) => {
  if (!expireTime) {
    return null;
  }

  const diff = account.lockDuration - account.warnLockDuration;
  const expireTimeInMilliseconds = new Date(expireTime).getTime();

  return new Date(expireTimeInMilliseconds - diff);
};

const TimeOutToast = ({ t, expireTime, ...props }) => {
  console.log(props.warningTime, props.expireTime);
  const dispatch = useDispatch();
  const renderToast = parseInt(props.minutes, 10) === 0 && parseInt(props.seconds, 10) === 1;
  //const renderToast = true;
  console.log(parseInt(props.minutes, 10), parseInt(props.seconds, 10));

  const onResetTime = () => {
    dispatch(timerReset(new Date(expireTime)));
  };

  const diff = (account.lockDuration - account.warnLockDuration) / 1000;
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
  expireTime,
}) => (
  <Countdown
    date={getWarningTime(expireTime)}
    renderer={
      ({ minutes, seconds }) => (
        <TimeOutToast
          t={t}
          minutes={minutes}
          seconds={seconds}
          warningTime={getWarningTime(expireTime)}
          expireTime={expireTime}
        />
      )
    }
  />
);

export default withTranslation()(WarningAutoSignOut);
