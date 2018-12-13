import React, { Fragment } from 'react';
import Options from '../dialog/options';
import routes from '../../constants/routes';
import styles from './customCountDown.css';

class CustomCountDown extends React.Component {
  componentDidUpdate() {
    const {
      minutes, seconds, resetTimer, t, setActiveDialog, closeDialog,
    } = this.props;

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
            onClickHandler: this.goTo.bind(this, routes.login.path),
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

  render() {
    const {
      minutes, autoLog, seconds, resetTimer, t,
    } = this.props;
    const min = minutes < 10 ? `0${minutes}` : minutes;
    const sec = seconds < 10 ? `0${seconds}` : seconds;

    const resetCondition = (minutes < 5);
    const timeoutCondition = (minutes === 0 && seconds === 0);

    const resetButton = resetCondition && !timeoutCondition ? <div onClick={() => {
      resetTimer();
    }} className={`${styles.reset} reset`}> {t('Reset')} </div> : <div></div>;

    const resetStyle = resetCondition ? styles.timeout : styles.default;
    const timer = !timeoutCondition
      && <span className={resetStyle}>{t('Session timeout in')} {min}:{sec}</span>;

    const renderComponent = autoLog ? (<div className={styles.timerRow}>
      {resetButton}
      {timer}
    </div>) : null;

    return (<Fragment>{renderComponent}</Fragment>);
  }
}
export default CustomCountDown;
