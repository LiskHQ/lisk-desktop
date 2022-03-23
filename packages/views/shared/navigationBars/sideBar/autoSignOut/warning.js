/* istanbul ignore file */
import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { timerReset } from '@common/store/actions';
import { account, timeOutWarningId } from '@common/configuration';
import styles from './autoSignOut.css';

const TimeOutToast = ({
  t, upDateCount, completed, expireTime,
}) => {
  const dispatch = useDispatch();

  const onResetTime = () => {
    if (new Date().getTime() < new Date(expireTime).getTime()) {
      upDateCount();
      dispatch(timerReset());
    }
  };

  const diff = (account.lockDuration - account.warnLockDuration) / 1000;
  const absTime = Math.abs(diff);
  const minutes = absTime / 60 >= 1 ? `${Math.floor(absTime / 60)}m ` : '';
  const seconds = absTime % 60 >= 1 ? `${absTime % 60}s` : '';

  return (
    completed && toast(
      <div className={styles.toastText}>
        <h5 className={styles.title}>{t('Warning: Session Timeout')}</h5>
        <p className={styles.content}>{t('Your session will be timed out in {{time}} if no network activity occurs.', { time: `${minutes}${seconds}` })}</p>
        <button
          className={`${styles.button} reset-time-button`}
          onClick={onResetTime}
        >
          {t('Reset time')}
        </button>
      </div>,
      {
        toastId: timeOutWarningId,
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
  expireTime,
}) => {
  const [count, setCount] = useState(1);

  const upDateCount = () => {
    setCount(count + 1);
  };

  return (
    <Countdown
      key={`timeout-warning-countdown-${count}`}
      date={warningTime}
      renderer={
        ({ completed }) => (
          <TimeOutToast
            t={t}
            completed={completed}
            upDateCount={upDateCount}
            expireTime={expireTime}
          />
        )
      }
    />
  );
};

export default withTranslation()(WarningAutoSignOut);
