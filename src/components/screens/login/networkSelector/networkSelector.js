import React, { useRef, useState } from 'react';

import {
  networks, networkKeys, keyCodes, tokenMap,
} from '@constants';
import { addHttp, getAutoLogInData } from '@utils/login';
import { getNetworksList } from '@utils/getNetwork';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import { Input } from '@toolbox/inputs';
import DropdownButton from '@toolbox/dropdownButton';
import { getNetworkConfig } from '@api/network';

import styles from './networkSelector.css';

const getNetwork = (name, url) => {
  const { nodes, initialSupply } = networks[name];
  const address = name === networkKeys.customNode
    ? addHttp(url) : nodes[0];

  return {
    name,
    initialSupply,
    address,
  };
};

const getInitialState = (address) => {
  const { liskServiceUrl } = getAutoLogInData();
  return {
    address: liskServiceUrl || address,
    connected: true,
    isValid: true,
    isCustomSelected: false,
    isValidationLoading: false,
  };
};


// eslint-disable-next-line max-statements
const NetworkSelector = ({
  t, selectedNetworkName, selectedAddress, networkSelected, settingsUpdated,
}) => {
  const networkList = getNetworksList();
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

  const setIsValid = (isValid) => {
    setState({ isValid });
  };

  const changeNetworkInSettings = (networkName) => {
    const { name, address } = getNetwork(networkName, state.address);
    if (address !== 'http://') {
      settingsUpdated({ network: { name, address } });
    }
  };

  const onSelectNetwork = (name) => {
    if (name !== networkKeys.customNode) {
      changeNetworkInSettings(name);
    } else {
      setState({ isCustomSelected: true });
    }
  };

  // eslint-disable-next-line max-statements
  const validateCorrectNode = async (networkName) => {
    const networkToSet = getNetwork(networkName, state.address);

    if (networkName === networkKeys.customNode) {
      try {
        const response = await getNetworkConfig({
          name: networkName,
          address: networkToSet.address,
        }, tokenMap.LSK.key);
        if (response) {
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

  const {
    address,
    isValid,
    connected,
    isCustomSelected,
    isValidationLoading,
  } = state;

  const validationError = isValid ? '' : t('Unable to connect to Lisk Service, please check the address and try again');

  return (
    <DropdownButton
      ref={childRef}
      buttonClassName={`${isValid ? '' : styles.dropdownError} ${styles.dropdownHandler} network`}
      wrapperClassName={styles.NetworkSelector}
      className={`${styles.menu} network-dropdown`}
      buttonLabel={(<span>{networks[selectedNetworkName]?.label}</span>)}
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
                  onClick={() => onSelectNetwork(networkKeys.customNode)}
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
                  onSelectNetwork(network.name);
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
