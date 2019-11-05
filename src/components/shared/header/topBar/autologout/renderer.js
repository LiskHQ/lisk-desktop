import React from 'react';
import routes from '../../../../../constants/routes';
import Piwik from '../../../../../utils/piwik';
import DialogHolder from '../../../../toolbox/dialog/holder';
import Dialog from '../../../../toolbox/dialog/dialog';
import { PrimaryButton, SecondaryButton } from '../../../../toolbox/buttons/button';


class CustomCountDown extends React.Component {
  constructor() {
    super();

    this.onResetTimer = this.onResetTimer.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  componentDidUpdate() {
    const { t } = this.props;
    const minutes = parseInt(this.props.minutes, 10);
    const seconds = parseInt(this.props.seconds, 10);

    const state = minutes === 0 && (
      (seconds === 59 && 'soon')
      || (seconds === 1 && 'complete')
    );

    const timeoutProps = {
      soon: {
        title: t('Timeout soon'),
        description: t('You will be signed out in a minute due to no network activity. You can turn off Auto-Logout in the settings.'),
        options: [{
          'data-path': routes.settings.path,
          onClick: this.goTo,
          children: t('Go to settings'),
        }, {
          onClick: this.onResetTimer,
          children: t('Reset timer & continue'),
        }],
      },
      complete: {
        title: t('Session timeout'),
        description: t('Your session was timed out after 10 minutes of no network activity. You may continue to use certain sections of your Lisk or sign back in to access everything.'),
        options: [{
          'data-path': routes.login.path,
          onClick: this.goTo,
          children: t('Sign back in'),
        }, {
          'data-path': routes.dashboard.path,
          onClick: this.goTo,
          children: t('Continue to Dashboard'),
        }],
      },
    }[state];
    if (state) {
      DialogHolder.showDialog(
        <Dialog>
          <Dialog.Title>{timeoutProps.title}</Dialog.Title>
          <Dialog.Description>
            {timeoutProps.description}
          </Dialog.Description>
          <Dialog.Options
            align="center"
          >
            <SecondaryButton {...timeoutProps.options[0]} />
            <PrimaryButton {...timeoutProps.options[1]} />
          </Dialog.Options>
        </Dialog>,
      );
    }
  }

  /* istanbul ignore next */
  goTo({ target: { dataset: { path } } }) {
    this.props.history.replace(path);
  }

  /* istanbul ignore next */
  onResetTimer() {
    Piwik.trackingEvent('CustomCountDown', 'button', 'Reset timer');
    this.props.resetTimer();
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return null;
  }
}
export default CustomCountDown;
