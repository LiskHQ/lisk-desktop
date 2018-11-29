// eslint-disable-line
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import i18next from 'i18next';
import Lisk from 'lisk-elements';

import ToolBoxDropdown from '../toolbox/dropdown/toolBoxDropdown';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import { PrimaryButton } from '../toolbox/buttons/button';
import { extractAddress } from '../../utils/account';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import styles from './login.css';
import networks from '../../constants/networks';
import routes from '../../constants/routes';
import feedbackLinks from '../../constants/feedbackLinks';
import getNetwork from '../../utils/getNetwork';
import { parseSearchParams } from './../../utils/searchParams';
import Box from '../box';
// eslint-disable-next-line import/no-unresolved
import SignUp from './signUp';
import { validateUrl, addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import { FontIcon } from '../fontIcon';

/**
 * The container component containing login
 * and create account functionality
 */
class Login extends React.Component {
  constructor(props) { // eslint-disable-line max-statements
    super(props);

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
      passphrase: '',
      address,
      network: loginNetwork.code,
      isLedgerLogin: false,
      isLedgerFirstLogin: false,
    };

    this.secondIteration = false;
    this.validators = {
      address: validateUrl,
      passphrase: this.validatePassphrase.bind(this),
    };
  }

  componentWillMount() {
    this.getNetworksList();
    i18next.on('languageChanged', () => {
      this.getNetworksList();
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

  getNetwork(chosenNetwork) {
    const network = Object.assign({}, getNetwork(chosenNetwork));
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  onLoginSubmission(passphrase) {
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

  getReferrerRoute() {
    const search = parseSearchParams(this.props.history.location.search);
    const dashboardRoute = `${routes.dashboard.path}`;
    const referrerRoute = search.referrer ? search.referrer : dashboardRoute;
    return referrerRoute;
  }

  // eslint-disable-next-line class-methods-use-this
  validatePassphrase(value, error) {
    const data = { passphrase: value };
    data.passphraseValidity = error || '';
    return data;
  }

  changeHandler(name, value, error) {
    const validator = this.validators[name] || (() => ({}));
    this.setState({
      [name]: value,
      ...validator(value, error),
    });

    if (name === 'network') {
      this.props.settingsUpdated({ network: value });
    }
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.onLoginSubmission(this.state.passphrase);
  }

  passFocused() {
    this.setState({
      passInputState: 'focused',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  showNetworkOptions() {
    const showNetwork = this.props.settings && this.props.settings.showNetwork;
    const params = parseSearchParams(this.props.history.location.search);
    const showNetworkParam = params.showNetwork || params.shownetwork;

    return showNetworkParam === 'true' || (showNetwork && showNetworkParam !== 'false');
  }

  validateCorrectNode() {
    const { address } = this.state;
    const nodeURL = address !== '' ? addHttp(address) : address;

    if (this.state.network === networks.customNode.code) {
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.liskAPIClientSet({
              network: this.getNetwork(this.state.network),
            });
            this.props.history.push(routes.register.path);
          } else {
            throw new Error();
          }
        }).catch(() => {
          this.props.errorToastDisplayed({ label: i18next.t('Unable to connect to the node') });
        });
    } else {
      const network = this.getNetwork(this.state.network);
      this.props.liskAPIClientSet({ network });
      this.props.history.push(routes.register.path);
    }
  }

  render() {
    const networkList = [{ label: this.props.t('Choose Network') }, ...this.networks];
    return (this.props.account.loading ?
      <div className={styles.loadingWrapper}></div> :
      <Box className={styles.wrapper}>
        <section className={`${styles.login} ${styles[this.state.passInputState]}`}>
          <section className={styles.table}>
            <header>
              {this.showNetworkOptions()
                ? <div>
                    <ToolBoxDropdown
                      auto={false}
                      source={networkList}
                      onChange={this.changeHandler.bind(this, 'network')}
                      label={this.props.t('Network to connect to')}
                      value={this.state.network}
                      className={`network ${styles.network}`}
                    />
                    {
                      this.state.network === networks.customNode.code &&
                      <ToolBoxInput type='text'
                             label={this.props.t('Enter IP or domain address of the node')}
                             name='address'
                             className={`address ${styles.outTaken}`}
                             theme={styles}
                             value={this.state.address}
                             error={this.state.addressValidity}
                             onChange={this.changeHandler.bind(this, 'address')}/>
                    }
                </div>
                : null
              }
            </header>
            <div className={`${styles.tableCell} text-left`}>
              <h2>{this.props.t('Sign in')}</h2>
              <form onSubmit={this.onFormSubmit.bind(this)}>
                <PassphraseInput label={this.props.t('Enter your passphrase')}
                  className='passphrase'
                  onFocus={this.passFocused.bind(this)}
                  theme={styles}
                  error={this.state.passphraseValidity}
                  value={this.state.passphrase}
                  onChange={this.changeHandler.bind(this, 'passphrase')} />
                {this.props.settings.isHarwareWalletConnected ?
                  <div>
                    <div className={styles.ledgerRow}>
                      <div>
                        <FontIcon className={styles.singUpArrow} value='usb-stick' />
                        {this.props.t('Hardware wallet login (beta):')}
                      </div>
                      <div className={`${styles.hardwareWalletLink} hardwareWalletLink`} onClick={() => {
                        this.props.history.replace(routes.hwWallet.path);
                      }}>
                        Ledger Nano S
                        <FontIcon className={styles.singUpArrow} value='arrow-right' />
                      </div>
                    </div>
                    <div className={styles.feedback}>
                      <a
                        className={styles.link}
                        target='_blank'
                        href={feedbackLinks.ledger}
                        rel='noopener noreferrer'>
                        {this.props.t('Give feedback about this feature')}
                        <FontIcon className={styles.singUpArrow} value='external-link' />
                      </a>
                    </div>
                  </div> : null }
                <footer className={ `${grid.row} ${grid['center-xs']}` }>
                  <div className={grid['col-xs-12']}>
                    <PrimaryButton label={this.props.t('Log in')}
                      className='login-button'
                      type='submit'
                      disabled={(this.state.network === networks.customNode.code
                        && !!this.state.addressValidity)
                      || !!this.state.passphraseValidity || this.state.passphrase === ''} />
                  </div>
                </footer>
              </form>
            </div>
          </section>
        </section>
        <SignUp
          t={this.props.t}
          passInputState={this.state.passInputState}
          validateCorrectNode={this.validateCorrectNode.bind(this)}/>
      </Box>
    );
  }
}

export default Login;
