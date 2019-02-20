// eslint-disable-line
import React from 'react';
import i18next from 'i18next';
import Lisk from 'lisk-elements';

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
import feedbackLinks from '../../constants/feedbackLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/headerV2';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import lock from '../../assets/images/icons-v2/lock.svg';
import styles from './loginV2.css';
import Piwik from '../../utils/piwik';

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
    this.validateCorrectNode = this.validateCorrectNode.bind(this);
  }

  componentDidMount() {
    // istanbul ignore else
    if (!this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.termsOfUse.path);
    }

    i18next.on('languageChanged', this.getNetworksList);
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
    Piwik.trackingEvent('Login V2', 'button', 'Login submission');
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

  validateCorrectNode(nextPath) {
    const { address } = this.state;
    const nodeURL = address !== '' ? addHttp(address) : address;
    if (this.state.network === networks.customNode.code) {
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.liskAPIClientSet({
              network: {
                ...this.getNetwork(this.state.network),
                address: nodeURL,
              },
            });
            this.props.history.push(nextPath);
          } else {
            throw new Error();
          }
        }).catch(() => {
          this.props.errorToastDisplayed({ label: i18next.t('Unable to connect to the node') });
        });
    } else {
      const network = this.getNetwork(this.state.network);
      this.props.liskAPIClientSet({ network });
      this.props.history.push(nextPath);
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
                {t('New to Lisk? ')}
                <Link className={`${styles.link}`}
                  to={routes.registerV2.path}>
                  {t('Create an Account')}
                </Link>
              </p>
            </div>

            <form onSubmit={this.onFormSubmit}>

              <div className={`${styles.inputsHolder}`}>
                <div className={`${styles.customNode} ${this.state.network === networks.customNode.code ? styles.showInput : ''}`}>
                  <h2 className={`${styles.inputLabel}`}>{t('Enter the IP or domain address of your node.')}</h2>
                  <div className={`${styles.addressInput} address`}>
                    <input
                      className={`${this.state.addressValidity ? 'error' : ''}`}
                      type="text"
                      value={this.state.address}
                      onChange={this.changeAddress} />
                    <span className={`${styles.errorMessage} ${this.state.addressValidity ? styles.showError : ''}`}>
                      { this.state.addressValidity }
                    </span>
                  </div>
                </div>

                <h2 className={`${styles.inputLabel}`}>
                  {t('Type or paste your passphrase here.')}
                  <Tooltip
                    className={`${styles.tooltip}`}
                    title={t('What is your passphrase?')}
                    footer={
                      <a href={links.whatIsAnPassphrase}
                        tabIndex={'-1'}
                        rel="noopener noreferrer"
                        target="_blank">
                          {t('Read More')}
                      </a>}>
                    <p className={`${styles.tooltipText}`}>
                      {t('Your passphrase is both  ')}
                      <strong>{t('your login and passphrase ')}</strong>
                      {t('to your Lisk Hub. It is provided during account registration.')}
                    </p>
                    <p className={`${styles.tooltipText}`}>
                      {t('You can use ')}
                      <strong>{t('tab or space ')}</strong>
                      {t('to go to the next field.')}
                    </p>
                  </Tooltip>
                </h2>

                <PassphraseInputV2
                  inputsLength={12}
                  onFill={this.checkPassphrase} />

                  <div className={`${styles.hardwareHolder} ${(this.props.settings && this.props.settings.isHarwareWalletConnected) ? styles.show : ''}`}>
                    <div className={`${styles.label}`}>
                      {t('Hardware login (beta): ')}
                      <span className={`${styles.link} hardwareWalletLink`}
                        onClick={() => this.validateCorrectNode(routes.hwWallet.path)}>
                        Ledger Nano S
                      </span>
                    </div>
                    <a
                      className={styles.link}
                      target='_blank'
                      href={feedbackLinks.ledger}
                      rel='noopener noreferrer'>
                      {t('Give feedback about this feature')}
                    </a>
                  </div>

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
                    className={'login-button'}
                    type='submit'
                    disabled={(this.state.network === networks.customNode.code
                      && !!this.state.addressValidity)
                      || !this.state.isValid
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
