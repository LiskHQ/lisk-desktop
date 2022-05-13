import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Tooltip from 'src/theme/Tooltip';
import Form from '../Form';
import FormInputField from '../FormInputTextField';
import FormCheckboxField from '../FormCheckboxField';
import styles from './SetPasswordFormField.css';

function SetPasswordForm({ onSubmit }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
        <h1>{t('Set up device password')}</h1>
        <p>
          {t('This password is used to encrypt your secret recovery phrase, which will be used for managing your account.')}
        </p>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ padding: '0px 30px' }}>
          <FormInputField
            secureTextEntry
            name="password"
            label={(
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Enter Password
                <Tooltip
                  position="right"
                  title={t('Bytes counter')}
                >
                  <p>
                    {
                      t(`Lisk counts your message in bytes, so keep in mind
                      that the length of your message may vary in different languages.
                      Different characters may consume a varying amount of bytes.`)
                    }
                  </p>
                </Tooltip>
              </span>
            )}
          />
        </div>
        <div style={{ padding: '0px 30px' }}>
          <FormInputField secureTextEntry name="password" label="Confirm your Password" />
        </div>
        <div style={{ padding: '0px 30px' }}>
          <FormInputField name="accountName" label="Account name (Optional)" />
        </div>
        <div style={{ padding: '16px 30px 13px 30px' }}>
          <FormCheckboxField
            name="hasAgreed"
            label="I agree to store my encrypted secret recovery phrase on this device."
          />
        </div>
        <div style={{ padding: '10px 30px', width: '100%', boxSizing: 'border-box' }}>
          <PrimaryButton
            type="submit"
            style={{ width: '100%' }}
          >
            {t('Save Account')}
          </PrimaryButton>
        </div>
      </Form>
    </div>
  );
}

export default SetPasswordForm;
