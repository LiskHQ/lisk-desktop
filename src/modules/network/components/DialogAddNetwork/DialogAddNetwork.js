import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { parseSearchParams } from 'src/utils/searchParams';
import Input from '@theme/Input';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import useSettings from '@settings/hooks/useSettings';
import { immutableSetToArray } from 'src/utils/immutableUtils';
import { regex } from 'src/const/regex';
import {
  DEFAULT_NETWORK_FORM_STATE,
  getDuplicateNetworkFields,
  useNetworkCheck,
} from '@network/components/DialogAddNetwork/utils';
import networks from '@network/configuration/networks';
import { useDispatch } from 'react-redux';
import { updateNetworkNameInApplications } from '@blockchainApplication/manage/store/action';
import styles from './DialogAddNetwork.css';

// eslint-disable-next-line max-statements,complexity
const DialogAddNetwork = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setValue, customNetworks } = useSettings('customNetworks');
  const { setValue: setMainChainNetwork, mainChainNetwork } = useSettings('mainChainNetwork');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();

  const { name: defaultName = '' } = parseSearchParams(history.location.search);

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: defaultName
      ? customNetworks.find((customNetwork) => customNetwork.name === defaultName)
      : DEFAULT_NETWORK_FORM_STATE,
  });
  const formValues = watch();
  const networkCheck = useNetworkCheck(formValues.serviceUrl);

  async function onTryNetworkUrl() {
    networkCheck.refetch();
  }

  // eslint-disable-next-line max-statements
  async function onSubmit(values) {
    setErrorText('');
    const fullNetworkList = [
      ...Object.values(networks).filter(({ isAvailable }) => isAvailable),
      ...customNetworks,
    ];
    const duplicateNetworkFields = getDuplicateNetworkFields(values, fullNetworkList, defaultName);
    if (duplicateNetworkFields) {
      const duplicates = Object.keys(duplicateNetworkFields)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' & ');
      return setErrorText(`${duplicates} already exists.`);
    }

    if (!networkCheck.isNetworkOK) return null;

    const wsServiceUrl = values.wsServiceUrl || values.serviceUrl.replace(/^http(s?)/, 'ws$1');
    const networkToAdd = { ...values, isAvailable: true, wsServiceUrl, label: values.name };
    const updatedCustomNetworks = immutableSetToArray({
      array: customNetworks,
      mapToAdd: networkToAdd,
      index: customNetworks.findIndex((network) => network.name === defaultName),
    });
    setValue(updatedCustomNetworks);

    if (defaultName) {
      dispatch(updateNetworkNameInApplications(defaultName, values.name));

      const isCurrentMainChainNetwork = mainChainNetwork.serviceUrl === networkToAdd.serviceUrl;
      if (isCurrentMainChainNetwork) {
        setMainChainNetwork(networkToAdd);
      }
    }

    if (!defaultName) {
      reset();
    }
    toast.info(t(`Custom network ${defaultName ? 'edited' : 'added'} "${values.name}"`), {
      position: 'bottom-right',
    });

    return history.goBack();
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
              value={formValues.serviceUrl}
              feedback={errors.serviceUrl?.message}
              status={errors.serviceUrl?.message ? 'error' : undefined}
              isLoading={networkCheck.isFetching}
              {...register('serviceUrl', {
                required: 'Service URL is required',
                pattern: { value: regex.url, message: t('Invalid URL') },
              })}
            />

            {!networkCheck.isNetworkOK && !!formValues.serviceUrl && !networkCheck.isFetching && (
              <span className={styles.connectionFailed}>
                <span className={styles.errorText}>
                  {t(
                    `Failed to fetch: ${!networkCheck.isOnchainOK ? 'onchain, ' : ''}${
                      !networkCheck.isOffchainOK ? 'offchain' : ''
                    } data. Please check the URL.`
                  )}
                </span>
                <TertiaryButton
                  type="button"
                  onClick={onTryNetworkUrl}
                  className={styles.tryAgainButton}
                >
                  {t('Retry')}
                </TertiaryButton>
              </span>
            )}
            <Input
              size="l"
              label="Websocket URL (Optional)"
              placeholder={t('Enter websocket service URL, e.g. wss://mainnet-service.lisk.com')}
              feedback={errors.wsServiceUrl?.message}
              status={errors.wsServiceUrl?.message ? 'error' : undefined}
              {...register('wsServiceUrl', {
                pattern: { value: regex.webSocketUrl, message: t('Invalid websocket URL') },
              })}
            />
            <PrimaryButton
              disabled={
                !isDirty ||
                !networkCheck.isNetworkOK ||
                networkCheck.isFetching ||
                networkCheck.isError
              }
              type="submit"
              className={`${styles.button}`}
              data-testId="add-network-button"
            >
              {t(`${!defaultName ? 'Add' : 'Save'} network`)}
            </PrimaryButton>
            {errorText && <span className={styles.errorText}>{errorText}</span>}
          </form>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default DialogAddNetwork;
