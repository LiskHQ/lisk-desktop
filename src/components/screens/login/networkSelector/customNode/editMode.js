import React, { useEffect, useRef, useState } from 'react';

import { tokenMap, networkKeys } from '@constants';
import { getNetworkConfig } from '@api/network';
import { PrimaryButton } from '@toolbox/buttons';
import { Input } from '@toolbox/inputs';
import { addHttp } from '@utils/login';
import styles from '../networkSelector.css';

const validateNode = async (address) => {
  try {
    const response = await getNetworkConfig({
      name: networkKeys.customNode,
      address,
    }, tokenMap.LSK.key);
    if (response) {
      return true;
    }
    throw new Error(`Failed to return response for custom node url: ${address}`);
  } catch (err) {
    throw new Error(`Error getting network config for address: ${address}: ${err.message}`);
  }
};

const EditMode = ({
  t, setMode, dropdownRef,
  storedCustomNetwork, networkSelected, customNetworkStored,
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    value: storedCustomNetwork ?? '',
    error: storedCustomNetwork ? 0 : -1,
    feedback: '',
  });
  const timeout = useRef();

  const validate = (value) => {
    clearTimeout(timeout.current);
    // validate the URL with debouncer
    timeout.current = setTimeout(() => {
      const normalized = addHttp(value);
      setLoading(true);
      validateNode(normalized)
        .then(() => {
          setAddress({
            value,
            error: 0,
            feedback: '',
          });
          setLoading(false);
        })
        .catch(() => {
          setAddress({
            value,
            error: 1,
            feedback: t('Unable to connect to Lisk Service, please check the address and try again'),
          });
          setLoading(false);
        });
    }, 500);
  };

  const onInputChange = ({ target }) => {
    setAddress({
      value: target.value,
      error: -1,
      feedback: '',
    });
    validate(target.value);
  };

  const connect = () => {
    const normalized = addHttp(address.value);
    networkSelected({
      name: networkKeys.customNode,
      initialSupply: 1,
      address: normalized,
    });
    customNetworkStored(normalized);
    setMode('read');
    dropdownRef.current.toggleDropdown(false);
  };

  useEffect(() => {
    if (!storedCustomNetwork && address.value) {
      setAddress({
        value: '',
        error: -1,
        feedback: '',
      });
    }
  }, [storedCustomNetwork]);

  return (
    <div
      className={`${styles.customNode} ${styles.editMode} address`}
    >
      <span className={styles.title}>{t('Custom Node')}</span>
      <div className={styles.actions}>
        <Input
          autoComplete="off"
          onChange={onInputChange}
          name="customNetwork"
          value={address.value}
          placeholder="e.g. https://service.lisk.com or 192.168.0.1:4000"
          size="xs"
          className={`custom-network ${styles.input}`}
          isLoading={loading}
          status={address.error < 1 ? 'ok' : 'error'}
          feedback={address.feedback}
        />
        <PrimaryButton
          disabled={address.error !== 0}
          onClick={connect}
          className={`${styles.button} ${styles.backButton} connect-button`}
          size="xs"
        >
          {t('Connect and save')}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default EditMode;
