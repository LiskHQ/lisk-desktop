import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from 'src/theme/Input';
import { PrimaryButton } from 'src/theme/buttons';
import CheckBox from 'src/theme/CheckBox';
import Tooltip from 'src/theme/Tooltip';
import { regex } from 'src/const/regex';
import { useEncryptAccount } from '@account/hooks';
import styles from './SetPasswordForm.css';

const setPasswordFormSchema = yup.object({
  accountName: yup.string()
    .matches(regex.accountName, 'Can be alpha numeric with either !,@,$,&,_,. as special characters')
    .max(20, 'Character length can\'t be more than 20')
    .min(3, 'Character length can\'t be lesser than 3'),
  password: yup.string().required()
    .matches(regex.accountNam, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
  cPassword: yup.string().required()
    .oneOf([yup.ref('password'), null], 'Confirm that passwords match'),
  hasAgreed: yup.boolean().required(),
}).required();

function SetPasswordForm({ onSubmit, recoveryPhrase }) {
  const { t } = useTranslation();
  const { encryptAccount } = useEncryptAccount();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(setPasswordFormSchema),
  });
  const formValues = watch();
  const {
    password, cPassword, accountName, hasAgreed,
  } = formValues;

  const isButtonDisabled = useMemo(() =>
    !password?.length || !cPassword?.length || !hasAgreed,
  [formValues.password, formValues.cPassword, formValues.hasAgreed]);

  const onFormSubmit = (values) => {
    encryptAccount({
      recoveryPhrase: recoveryPhrase.value,
      password: values.password,
      name: values.accountName,
    })
      .then(encryptdAccount => onSubmit?.(encryptdAccount))
      .catch((error) => {
        toast.error(t('Failed to setup password', error));
      });
  };

  return (
    <div data-testid="setPasswordFormContainer" className={styles.container}>
      <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
        <h1>{t('Set up device password')}</h1>
        <p>
          {t('This password is used to encrypt your secret recovery phrase, which will be used for managing your account.')}
        </p>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className={styles.fieldWrapper}>
          <Input
            size="xs"
            secureTextEntry
            feedback={errors.password?.message}
            status={errors.password ? 'error' : undefined}
            defaultValues=""
            value={password}
            label={(
              <span className="password-label-wrapper">
                Enter Password
                <Tooltip
                  position="right"
                  title={t('Requirements')}
                >
                  <p>
                    {
                      t('Password should be a combination of uppercase and lowercase alpha numeric characters with length more than 8')
                    }
                  </p>
                </Tooltip>
              </span>
            )}
            {...register('password')}
          />
        </div>
        <div className={styles.fieldWrapper}>
          <Input
            size="xs"
            secureTextEntry
            feedback={errors.cPassword?.message}
            status={errors.cPassword ? 'error' : undefined}
            label="Confirm your Password"
            defaultValues=""
            value={cPassword}
            {...register('cPassword')}
          />
        </div>
        <div className={styles.fieldWrapper}>
          <Input
            size="xs"
            feedback={errors.accountName?.message}
            status={errors.accountName ? 'error' : undefined}
            label="Account name (Optional)"
            defaultValues=""
            value={accountName}
            {...register('accountName')}
          />
        </div>
        <div className={`${styles.checkBoxWrapper}`}>
          <CheckBox
            className={`${styles.checkbox}`}
            {...register('hasAgreed')}
          />
          <span>{t('I agree to store my encrypted secret recovery phrase on this device.')}</span>
        </div>
        <div className={[styles.fieldWrapper, styles.submitWrapper]}>
          <PrimaryButton
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

export default withRouter(SetPasswordForm);
