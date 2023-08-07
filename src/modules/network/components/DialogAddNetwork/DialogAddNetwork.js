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
import { immutableSetToArray } from 'src/utils/immutableUtils';
import { regex } from 'src/const/regex';
import {
  DEFAULT_NETWORK_FORM_STATE,
  getDuplicateNetworkFields,
} from '@network/components/DialogAddNetwork/utils';
import networks from '../../configuration/networks';
import styles from './DialogAddNetwork.css';

const DialogAddNetwork = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setValue, customNetworks } = useSettings('customNetworks');
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const { name: defaultName = '' } = parseSearchParams(history.location.search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultName
      ? customNetworks.find((customNetwork) => customNetwork.name === defaultName)
      : DEFAULT_NETWORK_FORM_STATE,
  });

  // eslint-disable-next-line max-statements
  function onSubmit(values) {
    setSuccessText('');
    setErrorText('');
    const fullNetworkList = [...Object.values(networks), ...customNetworks];
    const duplicateNetworkFields = getDuplicateNetworkFields(values, fullNetworkList, defaultName);
    if (duplicateNetworkFields) {
      const duplicates = Object.keys(duplicateNetworkFields)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' & ');
      return setErrorText(`${duplicates} already exists.`);
    }

    const wsServiceUrl = values.serviceUrl.replace(/^http(s?)/, 'ws$1');
    const updatedCustomNetworks = immutableSetToArray({
      array: customNetworks,
      mapToAdd: { wsServiceUrl, isAvailable: true, ...values , label: values.name},
      index: customNetworks.findIndex((network) => network.name === defaultName),
    });
    setValue(updatedCustomNetworks);

    if (!defaultName) reset();

    return setSuccessText(`${t('Success: Network')} ${defaultName ? t('edited') : t('added')}`);
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
            <Input
              size="l"
              label="Websocket URL"
              placeholder={t('Enter service URL, e.g. wss://mainnet-service.lisk.com')}
              feedback={errors.wsServiceUrl?.message}
              status={errors.wsServiceUrl?.message ? 'error' : undefined}
              {...register('wsServiceUrl', {
                required: 'Service URL is required',
                pattern: { value: regex.webSocketUrl, message: t('Invalid websocket URL') },
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
