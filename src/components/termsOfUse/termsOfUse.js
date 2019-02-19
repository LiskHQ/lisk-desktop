import React from 'react';
import Piwik from '../../utils/piwik';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import logo from '../../assets/images/lisk-logo-v2.svg';
import routes from '../../constants/routes';
import styles from './termsOfUse.css';

class TermsOfUse extends React.Component {
  constructor() {
    super();

    this.onAccept = this.onAccept.bind(this);
  }

  componentDidMount() {
    this.onTermsOfUseAlreadyAccepted();
  }

  componentDidUpdate() {
    this.onTermsOfUseAlreadyAccepted();
  }

  onTermsOfUseAlreadyAccepted() {
    // istanbul ignore else
    if (!this.props.settings.isTermsOfUse) {
      this.props.history.push(routes.splashscreen.path);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  checkTermsOfUse() {
    Piwik.trackingEvent('SplashScreen', 'Link', 'Terms of Use');
  }

  onAccept() {
    Piwik.trackingEvent('SplashScreen', 'Button', 'Accept Terms of Use');
    this.props.settingsUpdated({ isTermsOfUse: true });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <img src={logo} />
        </header>
        <div className={styles.content}>
          <h1>{this.props.t('Lisk Terms if Use')}</h1>
          <p>
            {this.props.t('Before you continue using Lisk Hub, please read and accept the')}
            <a
              onClick={this.checkTermsOfUse}
              href={'https://lisk.io/terms-conditions'}
              target='_blank'
              rel='noopener noreferrer'
            >
              {this.props.t('Terms of Use')}
            </a>
          </p>
          <PrimaryButtonV2 onClick={this.onAccept} className={'accept-terms'}>
            {this.props.t('I have read and agree to the Terms of Use')}
          </PrimaryButtonV2>
        </div>
      </div>
    );
  }
}

export default TermsOfUse;
