/* eslint-disable max-lines */
import React from 'react';
import { toast } from 'react-toastify';
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { to } from 'await-to-js';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../../../utils/login';
import getNetwork, { getNetworksList } from '../../../../utils/getNetwork';
import networks from '../../../../constants/networks';
import styles from './networkSelector.css';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';

class NetworkSelector extends React.Component {
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
      showSettingDropdown: false,
      network: loginNetwork.code,
      isFirstTime: true,
      activeNetwork: 0,
      connected: true,
      networkLabel: 'Mainnet',
    };

    this.onConnectToCustomNode = this.onConnectToCustomNode.bind(this);
    this.checkNodeStatus = this.checkNodeStatus.bind(this);
    this.onChangeActiveNetwork = this.onChangeActiveNetwork.bind(this);
  }

  componentDidMount() {
    this.checkNodeStatus(false);

    // check the network, define selected
    if (!this.props.network.networks.LSK) {
      this.validateCorrectNode(networks.mainnet.code, networks.mainnet.nodes[0]);
    } else if (this.props.network.networks.LSK) {
      const { LSK } = this.props.network.networks;
      this.setState({
        address: LSK.nodeUrl,
        activeNetwork: LSK.code,
        network: LSK.code,
        networkLabel: this.props.network.name,
      });
    }
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
      network.address = addHttp(this.state.address.trim());
    }
    return network;
  }

  setValidationError(reset) {
    this.setState({
      validationError: reset ? '' : this.props.t('Unable to connect to the node, please check the address and try again'),
    });
  }

  /* istanbul ignore next */
  // eslint-disable-next-line max-statements
  validateCorrectNode(network, address, nextPath) {
    if (address !== '' && network === networks.customNode.code) {
      this.setState({ address: addHttp(address.trim()) });
    }
    const newNetwork = this.getNetwork(network);
    const nodeURL = network === networks.customNode.code
      ? addHttp(address.trim())
      : newNetwork.nodes[Math.floor(Math.random() * newNetwork.nodes.length)];

    const Lisk = liskClient('2');
    const liskAPIClient = new Lisk.APIClient([nodeURL], {});
    this.setValidationError(true);

    liskAPIClient.node.getConstants()
      // eslint-disable-next-line max-statements
      .then((res) => {
        if (res.data) {
          this.props.networkSet({
            name: newNetwork.name,
            network: newNetwork,
          });

          this.setState({
            validationError: '',
            connected: true,
            networkLabel: newNetwork.name,
          });
          if (network === networks.customNode.code && this.childRef.state.shownDropdown) {
            this.childRef.toggleDropdown();
          }
          this.props.networkStatusUpdated({ online: true });
          this.changeNetwork(networks.customNode.code);
          this.setState({ isValidationLoading: false, isFirstTime: false });
          this.props.history.push(nextPath);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        this.setValidationError();
        this.setState({ isValidationLoading: false, isFirstTime: false });
      });
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
      dark,
      t,
    } = this.props;
    const {
      isValidationLoading,
      connected,
      validationError,
      networkLabel,
    } = this.state;
    const { activeNetwork } = this.state;
    const networkList = getNetworksList();

    return (
      <DropdownButton
        buttonClassName={`${validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
        wrapperClassName={styles.NetworkSelector}
        className={`${styles.menu} ${dark ? 'dark' : ''} network-dropdown`}
        buttonLabel={(<span>{networkLabel}</span>)}
        ButtonComponent={SecondaryButton}
        align="right"
        ref={(node) => { this.childRef = node; }}
      >
        {
          networkList.map((item, key) => {
            const isActiveItem = activeNetwork === networks.customNode.code;

            if (item.value === networks.customNode.code) {
              return (
                <span
                  className={`${styles.networkSpan} address`}
                  key={key}
                  onClick={() => this.onChangeActiveNetwork(item.value)}
                >
                  {item.label}
                  <div className={styles.inputWrapper}>
                    <Input
                      autoComplete="off"
                      onChange={(value) => { this.changeAddress(value); }}
                      name="customNetwork"
                      value={this.state.address}
                      placeholder={this.props.t('i.e. ip:port, https://domain.tld')}
                      size="xs"
                      className={`custom-network ${styles.input} ${this.state.activeNetwork === 2 && validationError ? styles.errorInput : ''}`}
                      onKeyDown={e => e.keyCode === keyCodes.enter
                      && this.onConnectToCustomNode(e)}
                      isLoading={isValidationLoading && this.state.address}
                      status={connected ? 'ok' : 'error'}
                      feedback={this.state.activeNetwork === 2 ? validationError : ''}
                      dark={dark}
                    />
                    {
                      this.state.activeNetwork === 2 && validationError
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
                  this.onChangeActiveNetwork(item.value);
                  this.validateCorrectNode(item.value);
                  this.setState({ connected: false, isFirstTime: true });
                  this.childRef.toggleDropdown();
                }}
                key={key}
              >
                {item.label}
              </span>
            );
          })
        }
      </DropdownButton>
    );
  }
}

NetworkSelector.displayName = 'NetworkSelector';
export default withTranslation()(withRouter(NetworkSelector));
