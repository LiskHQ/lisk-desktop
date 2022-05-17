import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Input from 'src/theme/Input';
import { PrimaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import CheckBox from 'src/theme/CheckBox';
import Tooltip from 'src/theme/Tooltip';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './SetPasswordFormField.css';

const setPasswordFormSchema = yup.object({
  password: yup.string().required()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/g, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
  cpassword: yup.string().required()
    .oneOf([yup.ref('password'), null], 'Confrim passwords must match password'),
  hasAgreed: yup.boolean().required(),
}).required();

function SetPasswordForm({ onSubmit }) {
  const { t } = useTranslation();
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
    password, cpassword, accountName, hasAgreed,
  } = formValues;

  const isButtonDisabled = useMemo(() =>
    !password?.length || !cpassword?.length || !hasAgreed,
  [formValues.password, formValues.cpassword, formValues.hasAgreed]);

  return (
    <div>
      <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
        <h1>{t('Set up device password')}</h1>
        <p>
          {t('This password is used to encrypt your secret recovery phrase, which will be used for managing your account.')}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldWrapper}>
          <Input
            size="xs"
            secureTextEntry
            feedback={errors.password?.message}
            status={errors.password ? 'error' : undefined}
            defaultValues=""
            value={password}
            label={(
              <span className=".password-label-wrapper">
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
            feedback={errors.cpassword?.message}
            status={errors.cpassword ? 'error' : undefined}
            label="Confirm your Password"
            defaultValues=""
            value={cpassword}
            {...register('cpassword')}
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

export default SetPasswordForm;
