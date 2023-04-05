import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import Input from '@theme/Input';
import { PrimaryButton } from '@theme/buttons';
import useSettings from '@settings/hooks/useSettings';
import { imPush } from 'src/utils/immutableUtils';
import { regex } from 'src/const/regex';
import styles from './DialogAddNetwork.css';

const DialogAddNetwork = () => {
  const { setValue, customNetworks } = useSettings('customNetworks');
  const [successText, setSuccessText] = useState('');

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit(values) {
    setSuccessText('');
    const customNetwork = { ...values, label: values.name, isAvailable: true };
    const updatedCustomNetworks = imPush(customNetworks, customNetwork);
    setValue(updatedCustomNetworks);
    reset();
    setSuccessText(t('Success: ') + values.name + t(' added'));
  }

  return (
    <Dialog className={styles.DialogAddNetwork} hasClose>
      <Box className={styles.boxProp}>
        <BoxHeader className={classNames(styles.header)}>
          <h3 className={classNames(styles.title)}>{t('Add network')}</h3>
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
              placeholder={t('network name')}
              feedback={errors.name?.message}
              status={errors.name?.message ? 'error' : undefined}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              size="l"
              label="Service URL"
              placeholder={t('e.g https://service.lisk.com or localhost:9901')}
              feedback={errors.serviceUrl?.message}
              status={errors.serviceUrl?.message ? 'error' : undefined}
              {...register('serviceUrl', {
                required: 'Service URL is required',
                pattern: { value: regex.url, message: t('Invalid URL') },
              })}
            />
            <PrimaryButton type="submit" className={`${styles.button}`}>
              {t('Add network')}
            </PrimaryButton>
            {successText && <span className={styles.successText}>{successText}</span>}
          </form>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default DialogAddNetwork;
