import React from 'react';
import i18next from 'i18next';

import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { parseSearchParams } from './../../utils/searchParams';
import { extractAddress } from '../../utils/account';
import { validateUrl, addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import getNetwork from '../../utils/getNetwork';
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
    let address = '';

    if (loginNetwork) {
      loginNetwork = loginNetwork.slice(-1).shift();
    } else if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl;
    }

    this.state = {
      isValid: false,
      passphrase: '',
      network: loginNetwork.code,
      address,
    };

    this.secondIteration = false;

    this.getNetworksList();

    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.changeNetwork = this.changeNetwork.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onLoginSubmission = this.onLoginSubmission.bind(this);
  }

  componentDidMount() {
    i18next.on('languageChanged', () => {
      this.getNetworksList();
    });
  }

  componentDidUpdate(prevProps) {
    const params = parseSearchParams(prevProps.history.location.search);
    const showNetworkParam = params.showNetwork
      || params.shownetwork
      || (this.props.settings && this.props.settings.showNetwork);

    if (this.props.account &&
      this.props.account.address && (showNetworkParam !== 'true' || this.secondIteration) &&
      !this.alreadyLoggedWithThisAddress(prevProps.account.address, prevProps.peers.options)) {
      this.redirectToReferrer();
    }
  }

  getReferrerRoute() {
    const search = parseSearchParams(this.props.history.location.search);
    const dashboardRoute = `${routes.dashboard.path}`;
    const referrerRoute = search.referrer ? search.referrer : dashboardRoute;
    return referrerRoute;
  }

  redirectToReferrer() {
    const tem = this.getReferrerRoute();
    this.props.history.replace(tem);
  }

  alreadyLoggedWithThisAddress(address, network) {
    return this.props.account &&
      this.props.peers.options &&
      this.props.account.address === address &&
      this.props.peers.options.code === network.code &&
      this.props.peers.options.address === network.address;
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

  checkPassphrase(passphrase, validationError) {
    this.setState({
      passphrase,
      isValid: !validationError,
    });
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
      ...validateUrl(address),
    });
  }

  changeNetwork(network) {
    this.setState({ network });
    this.props.settingsUpdated({ network });
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(chosenNetwork) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.onLoginSubmission(this.state.passphrase);
  }

  onLoginSubmission(passphrase) {
    // Piwik.trackingEvent('Login', 'button', 'Login submission');
    const network = this.getNetwork(this.state.network);
    this.secondIteration = true;
    if (this.alreadyLoggedWithThisAddress(extractAddress(passphrase), network)) {
      this.redirectToReferrer();
    } else {
      this.props.liskAPIClientSet({
        passphrase,
        network,
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <HeaderV2
          networkList={this.networks}
          selectedNetwork={this.state.network}
          handleNetworkSelect={this.changeNetwork}
          showSettings={true}
          showNetwork={this.showNetworkOptions()} />
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

            <form onSubmit={this.onFormSubmit}>

              <div className={`${styles.inputsHolder}`}>
                <div className={`${styles.customNode} ${this.state.network === networks.customNode.code ? styles.showInput : ''}`}>
                  <h2 className={`${styles.inputLabel}`}>{t('Enter IP or domain address of the node')}</h2>
                  <div className={`${styles.addressInput}`}>
                    <input
                      className={`${this.state.addressValidity ? styles.error : ''}`}
                      type="url"
                      value={this.state.address}
                      onChange={this.changeAddress} />
                    <span className={`${styles.errorMessage}`}>
                      { this.state.addressValidity }
                    </span>
                  </div>
                </div>
                <h2 className={`${styles.inputLabel}`}>
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
                  onFill={this.checkPassphrase} />

              </div>

              <div className={`${styles.buttonsHolder} ${grid.row}`}>
                <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
                  <SecondaryButtonV2>
                    <FontIcon className={`${styles.icon}`}>arrow-left</FontIcon>
                    {t('Go Back')}
                  </SecondaryButtonV2>
                </Link>
                <span className={`${styles.button} ${grid['col-xs-4']}`}>
                  <PrimaryButtonV2
                    type='submit'
                    disabled={(this.state.network === networks.customNode.code
                      && !!this.state.addressValidity)
                      || !!this.state.passphraseValidity
                      || this.state.passphrase === ''}>
                    {t('Confirm')}
                    <FontIcon className={`${styles.icon}`}>arrow-right</FontIcon>
                  </PrimaryButtonV2>
                </span>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(LoginV2);
