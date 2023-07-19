import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from '@theme/Input';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import CheckBox from '@theme/CheckBox';
import Tooltip from '@theme/Tooltip';
import Icon from '@theme/Icon';
import { regex } from 'src/const/regex';
import { useEncryptAccount, useAccounts } from '@account/hooks';
import styles from './SetPasswordForm.css';

const setPasswordFormSchema = yup
  .object({
    accountName: yup.string().when((val) => {
      if (!val.length) {
        return yup.string().notRequired();
      }
      return yup
        .string()
        .matches(
          regex.accountName,
          'Can be alpha numeric with either !,@,$,&,_,. as special characters'
        )
        .max(20, "Character length can't be more than 20")
        .min(3, "Character length can't be less than 3");
    }),
    password: yup
      .string()
      .required()
      .matches(
        regex.password,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    cPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'Confirm that passwords match'),
    hasAgreed: yup.boolean().required(),
  })
  .required();

function SetPasswordForm({ prevStep, onSubmit, recoveryPhrase, customDerivationPath }) {
  const { t } = useTranslation();
  const { encryptAccount } = useEncryptAccount(customDerivationPath);
  const { accounts } = useAccounts();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(setPasswordFormSchema),
  });
  const formValues = watch();
  const { password, cPassword, hasAgreed } = formValues;

  const isButtonDisabled = useMemo(
    () => !password?.length || !cPassword?.length || !hasAgreed,
    [formValues.password, formValues.cPassword, formValues.hasAgreed]
  );
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line max-statements
  const onFormSubmit = async (values) => {
    setIsLoading(true);
    const existingAccountName = accounts.some(
      (acc) => acc.metadata.name.toLowerCase() === values.accountName.toLowerCase()
    );
    if (values.accountName && existingAccountName) {
      setError('accountName', {
        message: t(`Account with name "${values.accountName}" already exists.`),
      });
      return null;
    }
    const { error, result } = await encryptAccount({
      recoveryPhrase: recoveryPhrase.value,
      password: values.password,
      name: values.accountName,
    });

    if (error) {
      toast.error(t('Failed to setup password'));
      return null;
    }

    onSubmit?.(result);
    return setIsLoading(false);
  };

  return (
    <div data-testid="setPasswordFormContainer" className={styles.container}>
      <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
        <div className={grid.row}>
          <div className={grid['col-xs-1']}>
            <TertiaryButton onClick={() => prevStep()}>
              <Icon name="arrowLeftTailed" />
            </TertiaryButton>
          </div>
          <div className={grid['col-xs-11']}>
            <h1>{t('Set up your account password')}</h1>
          </div>
        </div>
        <p>
          {t(
            'This password will be used for decrypting your account every time you initiate any transaction from your wallet, and also during backup or removal of an account from the wallet.'
          )}
        </p>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className={styles.fieldWrapper}>
          <Input
            size="s"
            secureTextEntry
            feedback={errors.password?.message}
            status={errors.password ? 'error' : undefined}
            placeholder={t('Enter password')}
            label={
              <span className="password-label-wrapper">
                {t('Password')}
                <Tooltip position="right" title={t('Requirements')}>
                  <p>
                    {t(
                      'Password should be a combination of uppercase and lowercase alpha numeric characters with length more than 8'
                    )}
                  </p>
                </Tooltip>
              </span>
            }
            {...register('password')}
          />
        </div>
        <div className={styles.fieldWrapper}>
          <Input
            size="s"
            secureTextEntry
            feedback={errors.cPassword?.message}
            status={errors.cPassword ? 'error' : undefined}
            placeholder={t('Enter password confirmation')}
            label="Password confirmation"
            {...register('cPassword')}
          />
        </div>
        <div className={styles.fieldWrapper}>
          <Input
            size="s"
            feedback={errors.accountName?.message}
            status={errors.accountName ? 'error' : undefined}
            label="Account name (Optional)"
            placeholder={t('Enter account name')}
            {...register('accountName')}
          />
        </div>
        <label className={`${styles.checkBoxWrapper}`}>
          <CheckBox className={`${styles.checkbox}`} {...register('hasAgreed')} />
          <span>{t('I agree to store my encrypted secret recovery phrase on this device.')}</span>
        </label>
        <div className={[styles.fieldWrapper, styles.submitWrapper].join(' ')}>
          <PrimaryButton
            isLoading={isLoading}
            type="submit"
            style={{ width: '100%' }}
            disabled={isButtonDisabled}
          >
            {t('Save Account')}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

export default SetPasswordForm;
