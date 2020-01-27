/* eslint-disable max-lines */
import React from 'react';
import { toast } from 'react-toastify';
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { to } from 'await-to-js';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons/button';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../../../utils/login';
import getNetwork, { getNetworksList } from '../../../../utils/getNetwork';
import { parseSearchParams } from '../../../../utils/searchParams';
import Icon from '../../../toolbox/icon';
import UserAccount from '../topBar/accountMenu/userAccount';
import networks from '../../../../constants/networks';
import styles from './signInHeader.css';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';

class Header extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);
    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (loginNetwork) loginNetwork = loginNetwork.slice(-1).shift();
    if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl || props.address;
    }

    this.state = {
      address,
      showDropdown: false,
      showSettingDrowdown: false,
      network: loginNetwork.code,
      isFirstTime: true,
      activeNetwork: 0,
      connected: true,
    };

    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.onConnectToCustomNode = this.onConnectToCustomNode.bind(this);
    this.checkNodeStatus = this.checkNodeStatus.bind(this);
    this.onChangeActiveNetwork = this.onChangeActiveNetwork.bind(this);
  }

  componentDidMount() {
    this.checkNodeStatus(false);
  }

  componentDidUpdate(prevProps) {
    const { address, network } = this.props;
    if (address !== prevProps.address) this.setState(() => ({ address }));
    if (network.name !== prevProps.network.name) {
      this.setState({ activeNetwork: network.networks.LSK.code });
    }
    if (network.name !== prevProps.network.name) {
      this.checkNodeStatus(false);
    }
    if (network.name === networks.customNode.name && address !== prevProps.address) {
      this.checkNodeStatus(false);
    }
  }

  onChangeActiveNetwork(activeNetwork) {
    if (activeNetwork !== networks.customNode.code) this.changeNetwork(activeNetwork);
    this.setState({ activeNetwork });
  }

  // eslint-disable-next-line max-statements
  async checkNodeStatus(showErrorToaster = true) {
    const {
      liskAPIClient, network,
    } = this.props;

    if (liskAPIClient) {
      this.setState({
        network: network.networks.LSK.code,
        activeNetwork: network.networks.LSK.code,
      });
      const [error] = await to(liskAPIClient.node.getConstants());

      if (error) {
        if (network.name === networks.customNode.name) {
          this.setValidationError();
        } else {
          this.setState(({ validationError: '' }));
        }
        if (showErrorToaster) {
          toast.error(`Unable to connect to the node, Error: ${error.message}`);
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showNetworkOptions() {
    const showNetwork = this.props.settings && this.props.settings.showNetwork;
    const params = parseSearchParams(this.props.history.location.search);
    const showNetworkParam = params.showNetwork || params.shownetwork;

    return showNetworkParam === 'true' || (showNetwork && showNetworkParam !== 'false');
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
      isFirstTime: true,
      connected: false,
      validationError: '',
    });
  }

  changeNetwork(network) {
    this.setState({ network });
    const { name, address } = this.getNetwork(network);
    if (address !== 'http://') this.props.settingsUpdated({ network: { name, address } });
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(getNetworksList()[chosenNetwork].name) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  setValidationError() {
    this.setState({
      validationError: this.props.t('Unable to connect to the node, please check the address and try again'),
    });
  }

  /* istanbul ignore next */
  // eslint-disable-next-line max-statements
  validateCorrectNode(network, address, nextPath) {
    const nodeURL = address !== '' ? addHttp(address) : '';
    const newNetwork = this.getNetwork(network);

    if (network === networks.customNode.code) {
      const Lisk = liskClient();
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.networkSet({
              name: newNetwork.name,
              network: {
                ...newNetwork,
              },
            });

            this.props.history.push(nextPath);
            this.setState({ validationError: '', connected: true });
            this.childRef.toggleDropdown();
            this.changeNetwork(networks.customNode.code);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          this.setValidationError();
        });

      this.setState({ isValidationLoading: false, isFirstTime: false });
    } else {
      this.props.networkSet({
        name: newNetwork.name,
        network: {
          ...newNetwork,
        },
      });
      this.props.history.push(nextPath);
      this.setState({ validationError: '' });
    }

    this.setState({ network });
  }

  handleSettingsToggle() {
    this.setState({ showSettingDrowdown: !this.state.showSettingDrowdown });
  }

  onConnectToCustomNode(e) {
    e.stopPropagation();
    this.setState({ isValidationLoading: true });
    this.validateCorrectNode(networks.customNode.code, this.state.address);
  }

  /* istanbul ignore next */
  /* eslint-disable complexity */
  render() {
    const {
      account,
      address,
      dark,
      hideNetwork = false,
      selectedNetwork,
      settings,
      settingsUpdated,
      t,
    } = this.props;
    const {
      isValidationLoading,
      connected,
      validationError,
    } = this.state;
    const { showSettingDrowdown, activeNetwork } = this.state;
    const showNetworkOptions = !hideNetwork && this.showNetworkOptions();
    const networkList = getNetworksList();
    const isUserLogout = !!(Object.keys(account).length === 0 || account.afterLogout);
    const networkLabel = selectedNetwork !== networks.customNode.code
      ? networkList[selectedNetwork].label
      : address || this.state.address;

    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.headerContent}`}>
          <div className={`${styles.logo}`}>
            <Icon noTheme name="liskLogo" className="topbar-logo" />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            {
              showNetworkOptions
                ? (
                  <DropdownButton
                    buttonClassName={`${validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
                    className={`${styles.dropdown} ${dark ? 'dark' : ''} network-dropdown`}
                    buttonLabel={(<span>{networkLabel}</span>)}
                    ButtonComponent={SecondaryButton}
                    align="right"
                    ref={(node) => { this.childRef = node; }}
                  >
                    {
                      networkList && networkList.map((network, key) => {
                        const isActiveItem = activeNetwork === networks.customNode.code;

                        if (network.value === networks.customNode.code) {
                          return (
                            <span
                              className={`${styles.networkSpan} address`}
                              key={key}
                              onClick={() => this.onChangeActiveNetwork(network.value)}
                            >
                              {network.label}
                              <div className={styles.inputWrapper}>
                                <Input
                                  autoComplete="off"
                                  onChange={(value) => { this.changeAddress(value); }}
                                  name="customNetwork"
                                  value={this.state.address}
                                  placeholder={this.props.t('ie. 192.168.0.1')}
                                  size="xs"
                                  className={`custom-network ${styles.input} ${validationError ? styles.errorInput : ''}`}
                                  onKeyDown={e => e.keyCode === keyCodes.enter
                                  && this.onConnectToCustomNode(e)}
                                  isLoading={isValidationLoading && this.state.address}
                                  status={connected ? 'ok' : 'error'}
                                  feedback={validationError}
                                  dark={dark}
                                />
                                {
                                  validationError
                                    ? (
                                      <span className={styles.customNodeError}>
                                        {validationError}
                                      </span>
                                    )
                                    : null
                                }
                              </div>
                              {
                                isActiveItem
                                  ? (
                                    <div>
                                      <PrimaryButton
                                        disabled={this.state.connected}
                                      /* istanbul ignore next */
                                        onClick={this.onConnectToCustomNode}
                                        className={`${styles.button} ${styles.backButton} connect-button`}
                                        size="xs"
                                      >
                                        {this.state.connected ? t('Connected') : t('Connect')}
                                      </PrimaryButton>
                                    </div>
                                  )
                                  : ''
                              }
                            </span>
                          );
                        }

                        return (
                          <span
                            onClick={() => {
                              this.onChangeActiveNetwork(network.value);
                              this.validateCorrectNode(network.value);
                              this.setState({ connected: false, isFirstTime: true });
                              this.childRef.toggleDropdown();
                            }}
                            key={key}
                          >
                            {network.label}
                          </span>
                        );
                      })
                    }
                  </DropdownButton>
                )
                : null
            }
            <UserAccount
              token={settings.token}
              signInHolderClassName={styles.settings}
              account={account}
              isDropdownEnable={showSettingDrowdown}
              onDropdownToggle={this.handleSettingsToggle}
              onLogout={this.onLogout}
              settingsUpdated={settingsUpdated}
              isUserLogout={isUserLogout}
              t={t}
            />
          </div>
        </div>
      </header>
    );
  }
}

Header.displayName = 'SigninHeader';
export default withTranslation()(withRouter(Header));
