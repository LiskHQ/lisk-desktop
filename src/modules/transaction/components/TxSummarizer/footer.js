// istanbul ignore file
import React, { useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from 'src/theme/buttons';
import useSecondPassphrase from '@transaction/hooks/setSecondPassphrase';
import PassphraseInput from '@wallet/components/PassphraseInput/PassphraseInput';
import BoxFooter from 'src/theme/box/footer';
import { useAuth } from 'src/modules/auth/hooks/queries';
import { useCurrentAccount } from 'src/modules/account/hooks';
import styles from './txSummarizer.css';

const Actions = ({
  isMultisignature,
  cancelButton,
  confirmButton,
  inputStatus,
  t,
}) => (
  <div className={styles.primaryActions}>
    {cancelButton && (
      <SecondaryButton className={`cancel-button ${cancelButton.className || ''}`} onClick={cancelButton.onClick}>
        {cancelButton.label}
      </SecondaryButton>
    )}
    <PrimaryButton
      className={`${!cancelButton ? styles.confirmButton : ''} ${confirmButton?.className || ''} confirm-button`}
      disabled={
        confirmButton?.disabled
        || inputStatus === 'visible'
        || inputStatus === 'invalid'
      }
      onClick={confirmButton?.onClick}
    >
      {isMultisignature ? t('Sign') : confirmButton?.label}
    </PrimaryButton>
  </div>
);

const SecondPassInput = ({
  t,
  secondPassphraseStored,
  inputStatus,
  setInputStatus,
}) => {
  const [secondPass, set2ndPass] = useSecondPassphrase();

  useEffect(() => {
    if (secondPass.error === 0) {
      secondPassphraseStored(secondPass.data);
      setInputStatus('valid');
    } else if (secondPass.error > 0) {
      setInputStatus('invalid');
    }
  }, [secondPass]);

  return inputStatus === 'hidden' ? (
    <div className={styles.secondaryActions}>
      <span className={styles.or}>or</span>
      <TertiaryButton
        className="use-second-passphrase-btn"
        onClick={() => setInputStatus('visible')}
      >
        {t('Send using second passphrase right away')}
      </TertiaryButton>
    </div>
  ) : (
    <div className={styles.secondPassphrase}>
      <PassphraseInput
        t={t}
        onFill={set2ndPass}
        inputsLength={12}
        maxInputsLength={24}
      />
    </div>
  );
};

const Footer = ({
  confirmButton,
  cancelButton,
  footerClassName,
  t,
  secondPassphraseStored,
  account,
}) => {
  const [
    {
      metadata: { address },
    },
  ] = useCurrentAccount(); 
  const { data: authData } = useAuth({ config: { params: { address } } });
  const {numberOfSignatures, mandatoryKeys, optionalKeys } = useMemo(() => ({ ...authData?.data, ...authData?.meta }), [authData]);
  
  const isMultisignature = !!numberOfSignatures;
  const hasSecondPass = numberOfSignatures === 2
    && mandatoryKeys.length === 2
    && optionalKeys.length === 0
    && !account.hwInfo;
  const [inputStatus, setInputStatus] = useState(
    hasSecondPass ? 'hidden' : 'notRequired',
  );

  return (
    <BoxFooter
      className={`${footerClassName} ${
        inputStatus === 'hidden' ? styles.reverse : ''
      } summary-footer`}
      direction="horizontal"
    >
      {hasSecondPass ? (
        <SecondPassInput
          t={t}
          secondPassphraseStored={secondPassphraseStored}
          inputStatus={inputStatus}
          setInputStatus={setInputStatus}
        />
      ) : null}
      <Actions
        cancelButton={cancelButton}
        confirmButton={confirmButton}
        hasSecondPass={hasSecondPass}
        inputStatus={inputStatus}
        isMultisignature={isMultisignature}
        t={t}
      />
    </BoxFooter>
  );
};

export default Footer;
