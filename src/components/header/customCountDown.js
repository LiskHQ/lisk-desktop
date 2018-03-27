import React, { Fragment } from 'react';
import styles from './customCountDown.css';

const CustomCountDown = ({ minutes, autoLog, seconds, resetTimer, t }) => {
  const min = minutes < 10 ? `0${minutes}` : minutes;
  const sec = seconds < 10 ? `0${seconds}` : seconds;

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
