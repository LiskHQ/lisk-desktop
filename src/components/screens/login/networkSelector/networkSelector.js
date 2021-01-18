import React, { useEffect, useRef, useState } from 'react';

import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData } from '../../../../utils/login';
import { getNetworksList } from '../../../../utils/getNetwork';
import networks, { networkKeys } from '../../../../constants/networks';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';
import { tokenMap } from '../../../../constants/tokens';
import { getNetworkConfig } from '../../../../utils/api/network';
import { getApiClient } from '../../../../utils/api/apiClient';

import styles from './networkSelector.css';

const networkList = getNetworksList();

const getInitialState = (address) => {
  const { liskCoreUrl } = getAutoLogInData();
  return {
    address: liskCoreUrl || address,
    connected: true,
    isValid: true,
    isCustomSelected: false,
    isValidationLoading: false,
  };
};

// eslint-disable-next-line max-statements
const NetworkSelector = ({
  t, selectedNetworkName, selectedNetwork, selectedAddress, networkSelected, settingsUpdated,
}) => {
  const childRef = useRef(null);
  const [state, _setState] = useState(() => getInitialState(selectedAddress));
  const setState = newState => _setState(prevState => ({ ...prevState, ...newState }));

  const onChangeInput = ({ target }) => {
    const address = target.value;
    setState({
      address,
      connected: false,
      isValid: true,
    });
  };

  const getNetwork = (name) => {
    const { nodes, initialSupply } = networks[name];
    const address = name === networkKeys.customNode
      ? addHttp(state.address) : nodes[0];

    return {
      name,
      initialSupply,
      address,
    };
  };

  const changeNetworkInSettings = (networkName) => {
    const { name, address } = getNetwork(networkName);
    if (address !== 'http://') {
      settingsUpdated({ network: { name, address } });
    }
  };

  const onChangeNetwork = (networkName) => {
    if (networkName !== networkKeys.customNode) {
      changeNetworkInSettings(networkName);
    } else {
      setState({ isCustomSelected: true });
    }
  };

  const setIsValid = (validity) => {
    setState({ isValid: validity });
  };

  // eslint-disable-next-line max-statements
  const validateCorrectNode = async (networkName) => {
    const networkToSet = getNetwork(networkName);

    if (networkName === networkKeys.customNode) {
      const liskApiClient = getApiClient({ address: state.address });
      try {
        const response = await liskApiClient.node.getConstants();
        if (response.data) {
          setState({ isValid: true, connected: true });
          changeNetworkInSettings(networkName);
          networkSelected(networkToSet);
          childRef.current.toggleDropdown(false);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
      setState({ isValidationLoading: false });
    } else {
      setIsValid(true);
      networkSelected(networkToSet);
    }
  };

  const onConnectToCustomNode = (e) => {
    e.stopPropagation();
    setState({ isValidationLoading: true });
    validateCorrectNode(networkKeys.customNode);
  };

  const checkNodeStatus = () => {
    getNetworkConfig({
      name: selectedNetworkName,
      address: state.address,
    }, tokenMap.LSK.key).then((response) => {
      if (response) {
        if (selectedNetwork.name === networkKeys.customNode) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      }
    });
  };

  useEffect(() => {
    checkNodeStatus();
  }, [selectedNetworkName]);

  const {
    address,
    isValid,
    connected,
    isCustomSelected,
    isValidationLoading,
  } = state;

  const validationError = isValid ? '' : t('Unable to connect to the node, please check the address and try again');

  return (
    <DropdownButton
      ref={childRef}
      buttonClassName={`${isValid ? '' : styles.dropdownError} ${styles.dropdownHandler} network`}
      wrapperClassName={styles.NetworkSelector}
      className={`${styles.menu} network-dropdown`}
      buttonLabel={(<span>{networks[selectedNetworkName].label}</span>)}
      ButtonComponent={SecondaryButton}
      align="right"
    >
      {
          networkList.map((network, key) => {
            if (network.name === networkKeys.customNode) {
              return (
                <span
                  className={`${styles.networkSpan} address`}
                  key={key}
                  onClick={() => onChangeNetwork(network.name)}
                >
                  {network.label}
                  <div className={styles.inputWrapper}>
                    <Input
                      autoComplete="off"
                      onChange={onChangeInput}
                      name="customNetwork"
                      value={address}
                      placeholder="ie. 192.168.0.1"
                      size="xs"
                      className={`custom-network ${styles.input} ${isValid ? '' : styles.errorInput}`}
                      onKeyDown={e => e.keyCode === keyCodes.enter && onConnectToCustomNode(e)}
                      isLoading={isValidationLoading}
                      status={connected ? 'ok' : 'error'}
                      feedback={validationError}
                    />
                    {
                      !isValid
                        ? (
                          <span className={styles.customNodeError}>
                            {validationError}
                          </span>
                        )
                        : null
                    }
                  </div>
                  {
                    isCustomSelected
                      ? (
                        <div>
                          <PrimaryButton
                            disabled={connected}
                            /* istanbul ignore next */
                            onClick={onConnectToCustomNode}
                            className={`${styles.button} ${styles.backButton} connect-button`}
                            size="xs"
                          >
                            {connected ? t('Connected') : t('Connect')}
                          </PrimaryButton>
                        </div>
                      )
                      : null
                  }
                </span>
              );
            }

            return (
              <span
                onClick={() => {
                  onChangeNetwork(network.name);
                  validateCorrectNode(network.name);
                  setState({ connected: false });
                  childRef.current.toggleDropdown(false);
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
};

NetworkSelector.displayName = 'NetworkSelector';
export default NetworkSelector;
