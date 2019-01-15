import React from 'react';
import i18next from 'i18next';

import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { parseSearchParams } from './../../utils/searchParams';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import networks from '../../constants/networks';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/headerV2';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import lock from '../../assets/images/icons-v2/lock.svg';
import styles from './loginV2.css';

class LoginV2 extends React.Component {
  constructor() { // eslint-disable-line max-statements
    super();

    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();

    if (loginNetwork) {
      loginNetwork = loginNetwork.slice(-1).shift();
    } else if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
    }

    this.state = {
      isValid: false,
      passphrase: '',
      network: loginNetwork.code,
    };

    this.getNetworksList();

    this.passFocused = this.passFocused.bind(this);
  }

  componentDidMount() {
    i18next.on('languageChanged', () => {
      this.getNetworksList();
    });
  }

  passFocused() {
    this.setState({
      passInputState: 'focused',
    });
  }

  getNetworksList() {
    this.networks = Object.keys(networks)
      .filter(network => network !== 'default')
      .map((network, index) => ({
        label: i18next.t(networks[network].name),
        value: index,
      }));
  }

  // eslint-disable-next-line class-methods-use-this
  showNetworkOptions() {
    const showNetwork = this.props.settings && this.props.settings.showNetwork;
    const params = parseSearchParams(this.props.history.location.search);
    const showNetworkParam = params.showNetwork || params.shownetwork;

    return showNetworkParam === 'true' || (showNetwork && showNetworkParam !== 'false');
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <HeaderV2 networkList={this.networks}
          showSettings={true} showNetwork={this.showNetworkOptions()} />
        <div className={`${styles.login} ${grid.row}`}>
          <div
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>

            <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
              <h1>
                <img src={lock} />
                {t('Sign in with a Passphrase')}
              </h1>
              <p>
                {t('New to Lisk?')}
                <Link className={`${styles.link}`}
                  to={routes.registration.path}>
                  {t('Create an Account')}
                </Link>
              </p>
            </div>

            <div className={`${styles.inputsHolder}`}>
              <h2>
                {t('Type or insert your passphrase')}
                <Tooltip
                  className={`${styles.tooltip}`}
                  title={'What is passphrase?'}
                  footer={
                    <a href={links.howToStorePassphrase}
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>}>
                  <p>
                    {t('Passphrase is both your login and password combined. ')}
                    {t('You saved your password when registering your account.')}
                  </p>
                  <p>{t('You can use tab or space to go to the next field.')}</p>
                  <p>{t('For longer passphrases, simply paste it in the first input field.')}</p>
                </Tooltip>
              </h2>

              <PassphraseInputV2
                className='passphrase'
                onFocus={this.passFocused.bind(this)}
                error={this.state.passphraseValidity}
                value={this.state.passphrase} />

            </div>

            <div className={`${styles.buttonsHolder} ${grid.row}`}>
              <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
                <SecondaryButtonV2>
                  <FontIcon className={`${styles.icon}`}>arrow-left</FontIcon>
                  {t('Go Back')}
                </SecondaryButtonV2>
              </Link>
              <span className={`${styles.button} ${grid['col-xs-4']}`}>
                <PrimaryButtonV2 disabled={!this.state.isValid}>
                  {t('Confirm')}
                  <FontIcon className={`${styles.icon}`}>arrow-right</FontIcon>
                </PrimaryButtonV2>
              </span>
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(LoginV2);
