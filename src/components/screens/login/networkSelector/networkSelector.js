/* eslint-disable max-lines */
import React from 'react';
import { toast } from 'react-toastify';
import { APIClient } from '@liskhq/lisk-client'; // eslint-disable-line
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../../../utils/login';
import getNetwork, { getNetworksList } from '../../../../utils/getNetwork';
import networks from '../../../../constants/networks';
import styles from './networkSelector.css';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';
import { isEmpty } from '../../../../utils/helpers';
import { tokenMap } from '../../../../constants/tokens';
import { getNetworkConfig } from '../../../../utils/api/network';

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
    };

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
    const { network } = this.props;

    if (network && !isEmpty(network)) {
      this.setState({
        network: network.networks.LSK.code,
        activeNetwork: network.networks.LSK.code,
      });

      const response = getNetworkConfig(network, tokenMap.LSK.key);

      if (response.data) {
        if (network.name === networks.customNode.name) {
          this.setValidationError();
        } else {
          this.setState(({ validationError: '' }));
        }
      }
      if (showErrorToaster) {
        toast.error(`Unable to connect to the node, Error: ${response.message}`);
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

    console.log('nodeURL', nodeURL);

    if (network === networks.customNode.code) {
      const liskAPIClient = new APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          console.log('this.props.networkSet', res);
          if (res.data) {
            this.props.networkSet({
              name: newNetwork.name,
              network: {
                ...newNetwork,
              },
            });

            console.log('getConstant > ', newNetwork);

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

  onConnectToCustomNode(e) {
    e.stopPropagation();
    this.setState({ isValidationLoading: true });
    this.validateCorrectNode(networks.customNode.code, this.state.address);
  }

  /* istanbul ignore next */
  /* eslint-disable complexity */
  render() {
    const {
      address,
      dark,
      selectedNetwork,
      t,
    } = this.props;
    const {
      isValidationLoading,
      connected,
      validationError,
    } = this.state;
    const { activeNetwork } = this.state;
    const networkList = getNetworksList();
    const networkLabel = selectedNetwork !== networks.customNode.code
      ? networkList[selectedNetwork].label
      : address || this.state.address;

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
          networkList.map((network, key) => {
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
    );
  }
}

NetworkSelector.displayName = 'NetworkSelector';
export default withTranslation()(withRouter(NetworkSelector));
