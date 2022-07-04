import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import PassphraseBackup from '@auth/components/passphraseBackup';
import registerStyles from '../Signup/register.css';

const SavePassphrase = ({
  t, passphrase, prevStep, nextStep,
}) => (
  <>
    <div className={registerStyles.titleHolder}>
      <h1>{t('Save your secret recovery phrase')}</h1>
      <p>{t('Keep it safe as it is the only way to access your wallet.')}</p>
    </div>
    <div
      className={`${grid['col-sm-10']} ${registerStyles.passphraseBackupContainer}`}
    >
      <PassphraseBackup
        passphrase={passphrase}
        t={t}
        paperWalletName="lisk_passphrase_store_safely"
      />
    </div>

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <span className={`${registerStyles.button} ${registerStyles.backButton}`}>
        <TertiaryButton onClick={prevStep}>{t('Go back')}</TertiaryButton>
      </span>
      <span className={`${registerStyles.button}`}>
        <PrimaryButton
          className={`${registerStyles.continueBtn} yes-its-safe-button`}
          onClick={() => nextStep()}
        >
          {t('I have written them down')}
        </PrimaryButton>
      </span>
    </div>
  </>
);

export default withTranslation()(SavePassphrase);
