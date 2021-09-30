import React, { useEffect, useRef, useState } from 'react';

import { tokenMap } from '@constants';
import { getNetworkConfig } from '@api/network';
import { PrimaryButton } from '@toolbox/buttons';
import { Input } from '@toolbox/inputs';
import styles from '../networkSelector.css';

const validateNode = async (address) => {
  try {
    const response = await getNetworkConfig({
      name: 'customNode',
      address,
    }, tokenMap.LSK.key);
    if (response) {
      return true;
    }
    throw new Error('error connecting');
  } catch {
    throw new Error('error connecting');
  }
};

const EditMode = ({
  t, setMode, dropdownRef,
  storedCustomNetwork, networkSelected, customNetworkStored,
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    value: storedCustomNetwork.length ? storedCustomNetwork : '',
    error: storedCustomNetwork.length ? 0 : -1,
    feedback: '',
  });
  const timeout = useRef();

  const validate = (value) => {
    clearTimeout(timeout.current);
    // validate the URL with debouncer
    timeout.current = setTimeout(() => {
      setLoading(true);
      validateNode(value)
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
    networkSelected({
      name: 'customNode',
      initialSupply: 1,
      address: address.value,
    });
    customNetworkStored(address.value);
    setMode('read');
    dropdownRef.current.toggleDropdown(false);
  };

  useEffect(() => {
    if (storedCustomNetwork.length === 0 && address.value) {
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
          placeholder="e.g. https://mainnet-service.lisk.io or 192.168.0.1:4000"
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
