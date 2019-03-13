import React, { Fragment } from 'react';
import Options from '../dialog/options';
import routes from './../../constants/routes';
import Piwik from '../../utils/piwik';
import styles from './customCountDown.css';

class CustomCountDown extends React.Component {
  componentDidUpdate() {
    const {
      resetTimer, t, setActiveDialog, closeDialog,
    } = this.props;
    const minutes = parseInt(this.props.minutes, 10);
    const seconds = parseInt(this.props.seconds, 10);

    if (minutes === 0 && seconds === 59) {
      setActiveDialog({
        childComponent: Options,
        childComponentProps: {
          title: t('Timeout soon'),
          text: t('You will be signed out in a minute due to no network activity. You can turn off Auto-Logout in the settings.'),
          firstButton: {
            text: t('Go to settings'),
            onClickHandler: this.goTo.bind(this, routes.setting.path),
          },
          secondButton: {
            text: t('Reset timer & continue'),
            onClickHandler: /* istanbul ignore next */ () => {
              resetTimer();
              closeDialog();
            },
          },
        },
      });
    }
    if (minutes === 0 && seconds === 1) {
      setActiveDialog({
        childComponent: Options,
        childComponentProps: {
          title: t('Session timeout'),
          text: t('Your session was timed out after 10 minutes of no network activity. You may continue to use certain sections of your Lisk Hub or sign back in to access everything.'),
          firstButton: {
            text: t('Sign back in'),
            onClickHandler: this.goTo.bind(this, routes.loginV2.path),
          },
          secondButton: {
            text: t('Continue to Dashboard'),
            onClickHandler: this.goTo.bind(this, routes.dashboard.path),
          },
        },
      });
    }
  }

  /* istanbul ignore next */
  goTo(path) {
    this.props.history.replace(path);
    this.props.closeDialog();
  }

  onResetTimer() {
    Piwik.trackingEvent('CustomCountDown', 'button', 'Reset timer');
    this.props.resetTimer();
  }

  render() {
    const {
      minutes,
      autoLog,
      seconds,
      t,
    } = this.props;
    const min = `0${minutes}`.slice(-2);
    const sec = `0${seconds}`.slice(-2);

    const resetCondition = (minutes < 5);
    const timeoutCondition = (minutes === 0 && seconds === 0);

    const resetButton = resetCondition && !timeoutCondition ?
      <div
        onClick={() => this.onResetTimer()}
        className={`${styles.reset} reset`}
      >
      {t('Reset')}
      </div> :
      <div></div>;

    const resetStyle = resetCondition ? styles.timeout : styles.time;
    const timer = !timeoutCondition &&
      <p className={styles.default}>{t('Session timeout in')} <span className={resetStyle}>{min}:{sec}</span></p>;

    const renderComponent = autoLog ? (<div className={styles.timerRow}>
      {resetButton}
      {timer}
    </div>) : null;

    return (<Fragment>{renderComponent}</Fragment>);
  }
}
export default CustomCountDown;
