// istanbul ignore file
import React, { useMemo } from 'react';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxFooter from 'src/theme/box/footer';
import { useAuth } from 'src/modules/auth/hooks/queries';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { useSelector } from 'react-redux';
import { selectCurrentHWDevice } from '@hardwareWallet/store/selectors/hwSelectors';
import styles from './txSummarizer.css';

const Actions = ({ isMultisignature, cancelButton, confirmButton, inputStatus, t }) => (
  <div className={styles.primaryActions}>
    {cancelButton && (
      <SecondaryButton
        className={`cancel-button ${cancelButton.className || ''}`}
        onClick={cancelButton.onClick}
      >
        {cancelButton.label}
      </SecondaryButton>
    )}
    <PrimaryButton
      className={`${!cancelButton ? styles.confirmButton : ''} ${
        confirmButton?.className || ''
      } confirm-button`}
      disabled={confirmButton?.disabled || inputStatus === 'visible' || inputStatus === 'invalid'}
      onClick={confirmButton?.onClick}
    >
      {isMultisignature ? t('Sign') : confirmButton?.label}
    </PrimaryButton>
  </div>
);

const Footer = ({ confirmButton, cancelButton, footerClassName, t }) => {
  const [
    {
      metadata: { address, isHW },
    },
  ] = useCurrentAccount();
  const { isAppOpen } = useSelector(selectCurrentHWDevice);

  const { data: authData } = useAuth({ config: { params: { address } } });
  const { numberOfSignatures } = useMemo(
    () => ({ ...authData?.data, ...authData?.meta }),
    [authData]
  );

  const isMultisignature = !!numberOfSignatures;

  return (
    <BoxFooter className={`${footerClassName} summary-footer`} direction="horizontal">
      {isHW && !isAppOpen && (
        <div className={styles.errorLabel}>
          <span>{t('Open the Lisk app to continue')}</span>
        </div>
      )}
      <Actions
        cancelButton={cancelButton}
        confirmButton={{
          ...confirmButton,
          disabled: isHW ? !isAppOpen || confirmButton.disabled : confirmButton.disabled,
        }}
        isMultisignature={isMultisignature}
        t={t}
      />
    </BoxFooter>
  );
};

export default Footer;
