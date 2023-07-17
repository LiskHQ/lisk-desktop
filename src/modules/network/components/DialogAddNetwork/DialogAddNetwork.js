import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { parseSearchParams } from 'src/utils/searchParams';
import Input from '@theme/Input';
import { PrimaryButton } from '@theme/buttons';
import useSettings from '@settings/hooks/useSettings';
import { immutablePush, immutableSetToArray } from 'src/utils/immutableUtils';
import { regex } from 'src/const/regex';
import networks, { networkKeys } from '../../configuration/networks';
import styles from './DialogAddNetwork.css';

const DialogAddNetwork = () => {
  const history = useHistory();
  const { name: defaultName = '', serviceUrl: defaultServiceUrl = '' } = parseSearchParams(
    history.location.search
  );
  const { setValue, customNetworks } = useSettings('customNetworks');
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultName,
      serviceUrl: defaultServiceUrl,
    },
  });

  // eslint-disable-next-line max-statements
  function onSubmit(values) {
    setSuccessText('');
    setErrorText('');
    const wsServiceUrl = values.serviceUrl.replace(/^http(s?)/, 'ws$1');
    const customNetwork = { ...values, wsServiceUrl, label: values.name, isAvailable: true };
    let updatedCustomNetworks;
    const fullNetworkList = [...Object.values(networks), ...customNetworks];
    const existingCustomNetworkName = fullNetworkList.some(
      (network) => network.name.toLowerCase() === values.name.toLowerCase()
    );
    // Since the localhost address exists in the default networks list
    // ensure that it can still be added as a custom network
    const existingCustomNetworkServiceUrl = fullNetworkList
      .filter((network) => network.name !== networkKeys.customNode)
      .some((network) => network.serviceUrl === values.serviceUrl);
    if (
      (!defaultName || (defaultName && defaultName !== values.name)) &&
      (existingCustomNetworkName || existingCustomNetworkServiceUrl)
    ) {
      setErrorText('Network name or serviceUrl already exists');
      return;
    }
    if (defaultName) {
      const editedCustomNetworkIndex = customNetworks.findIndex(
        (network) => network.name === defaultName
      );
      updatedCustomNetworks = immutableSetToArray({
        array: customNetworks,
        mapToAdd: customNetwork,
        index: editedCustomNetworkIndex,
      });
    } else {
      updatedCustomNetworks = immutablePush(customNetworks, customNetwork);
      reset();
    }
    setValue(updatedCustomNetworks);

    setSuccessText(`${t('Success: Network')} ${defaultName ? t('edited') : t('added')}`);
  }

  return (
    <Dialog className={styles.DialogAddNetwork} hasClose>
      <Box className={styles.boxProp}>
        <BoxHeader className={classNames(styles.header)}>
          <h3 className={classNames(styles.title)}>
            {t(`${!defaultName ? 'Add' : 'Edit'} network`)}
          </h3>
        </BoxHeader>
        <p className={classNames(styles.description)}>
          {t(
            '"Lisk" will be the default mainchain application, please enter your custom network to be added to the wallet.'
          )}
        </p>
        <BoxContent className={`${styles.content}`}>
          <form className={classNames(styles.form)} onSubmit={handleSubmit(onSubmit)}>
            <Input
              size="l"
              label="Name"
              placeholder={t('Enter network name')}
              feedback={errors.name?.message}
              status={errors.name?.message ? 'error' : undefined}
              {...register('name', {
                required: 'Name is required',
                pattern: { value: regex.networkName, message: t('Invalid network name') },
              })}
            />
            <Input
              size="l"
              label="Service URL"
              placeholder={t(
                'Enter service URL, e.g. https://service.lisk.com or http://localhost:9901'
              )}
              feedback={errors.serviceUrl?.message}
              status={errors.serviceUrl?.message ? 'error' : undefined}
              {...register('serviceUrl', {
                required: 'Service URL is required',
                pattern: { value: regex.url, message: t('Invalid URL') },
              })}
            />
            <PrimaryButton type="submit" className={`${styles.button}`}>
              {t(`${!defaultName ? 'Add' : 'Save'} network`)}
            </PrimaryButton>
            {successText && <span className={styles.successText}>{successText}</span>}
            {errorText && <span className={styles.errorText}>{errorText}</span>}
          </form>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default DialogAddNetwork;
