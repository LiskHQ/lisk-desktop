import React, { Fragment } from 'react';
import Options from '../dialog/options';
import routes from './../../constants/routes';
import styles from './customCountDown.css';

const CustomCountDown = ({
  minutes, autoLog, seconds, resetTimer, t, setActiveDialog, closeDialog, history,
}) => {
  const min = minutes < 10 ? `0${minutes}` : minutes;
  const sec = seconds < 10 ? `0${seconds}` : seconds;
  if (min === '04' && sec === 59) {
    setActiveDialog({
      childComponent: Options,
      childComponentProps: {
        title: t('Timeout soon'),
        text: t('You will be signed out in a minute due to no network activity. You can turn off Auto-Logout in the settings.'),
        firstButton: {
          text: t('Go to settings'),
          onClickHandler: () => {
            history.replace(routes.setting.path);
            closeDialog();
          },
        },
        secondButton: {
          text: t('Reset timer & continue'),
          onClickHandler: () => {
            resetTimer();
            closeDialog();
          },
        },
      },
    });
  }
  if (min === '00' && sec === '01') {
    setActiveDialog({
      childComponent: Options,
      childComponentProps: {
        title: t('Session tieout'),
        text: t('Your session was timed out after 10 minutes of no network activitiy. You may continue to use certain sections of your Lisk Hub or sign back in to access everything.'),
        firstButton: {
          text: t('Sign back in'),
          onClickHandler: () => {
            history.replace(routes.login.path);
            closeDialog();
          },
        },
        secondButton: {
          text: t('Continue to Dashboard'),
          onClickHandler: () => {
            history.replace(routes.dashboard.path);
            closeDialog();
          },
        },
      },
    });
  }

  const resetCondition = (minutes < 5);
  const timeoutCondition = (minutes === 0 && seconds === 0);

  const resetButton = resetCondition && !timeoutCondition ? <div onClick={() => {
    resetTimer();
  }} className={`${styles.reset} reset`}> {t('Reset')} </div> : <div></div>;

  const resetStyle = resetCondition ? styles.timeout : styles.default;
  const timer = !timeoutCondition &&
    <span className={resetStyle}>{t('ID lock in')} {min}:{sec}</span>;

  const renderComponent = autoLog ? (<div className={styles.timerRow}>
    {resetButton}
    {timer}
  </div>) : <div className='unlocked'>{t('Unlocked')}</div>;

  return (<Fragment>{renderComponent}</Fragment>);
};

export default CustomCountDown;
