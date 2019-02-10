import React from 'react';
import Countdown from 'react-countdown-now';
import CountDownTemplate from '../header/countDownTemplate';
import CustomCountDown from '../header/customCountDown';
import routes from '../../constants/routes';
import Network from './network';
import ExternalLinks from './externalLinks';
import feedbackLinks from '../../constants/feedbackLinks';
import svg from '../../utils/svgIcons';
import styles from './statusBar.css';

class StatusBar extends React.Component {
  onCountdownComplete() {
    this.props.logOut();
    this.props.history.replace(routes.login.path);
  }

  isTimerEnabled() {
    const { autoLogout, account } = this.props;

    return autoLogout &&
      account.expireTime &&
      account.expireTime !== 0 &&
      account.passphrase &&
      account.passphrase.length > 0;
  }


  linksList() {
    return [
      {
        label: this.props.t('Feedback'),
        path: `${feedbackLinks.general}`,
        id: 'feedback',
        icon: svg.feedback_icon,
        internal: false,
      },
      {
        label: this.props.t('Help'),
        path: `${routes.help.path}`,
        id: 'help',
        icon: svg.help_icon,
        internal: true,
      },
    ];
  }

  render() {
    const {
      account,
      autoLogout,
      closeDialog,
      history,
      peers,
      resetTimer,
      setActiveDialog,
      showNetworkIndicator,
      t,
    } = this.props;

    return (
      <div className={`bottom-bar ${styles.wrapper}`}>
        <div className={`${styles.timer}`}>
          {
            this.isTimerEnabled() ?
              (
              <Countdown
                date={account.expireTime}
                onComplete={() => this.onCountdownComplete()}
                renderer={CountDownTemplate}
              >
                <CustomCountDown
                  autoLog={autoLogout}
                  closeDialog={closeDialog}
                  history={history}
                  resetTimer={resetTimer}
                  setActiveDialog={setActiveDialog}
                  t={t}
                />
              </Countdown>
              )
              : null}
        </div>
        <Network
          peers={peers}
          t={t}
          showNetworkIndicator={showNetworkIndicator}
        />
        <ExternalLinks
          links={this.linksList()}
        />
      </div>
    );
  }
}

export default StatusBar;
