import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from '@basics/buttons';
import PassphraseBackup from '@wallet/detail/identity/passphraseBackup';
import registerStyles from './register.css';

const BackupPassphrase = ({
  t, account, prevStep, nextStep,
}) => (
  <>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Save your passphrase')}
      </h1>
      <p>{t('Keep it safe as it is the only way to access your wallet.')}</p>
    </div>
    <div className={`${grid['col-sm-10']} ${registerStyles.passphraseBackupContainer}`}>
      <PassphraseBackup
        account={account}
        t={t}
        paperWalletName="lisk_passphrase_store_safely"
        passphraseName={t('Passphrase')}
      />
    </div>

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <span className={`${registerStyles.button} ${registerStyles.backButton}`}>
        <TertiaryButton onClick={prevStep}>
          {t('Go back')}
        </TertiaryButton>
      </span>
      <span className={`${registerStyles.button}`}>
        <PrimaryButton
          className={`${registerStyles.continueBtn} yes-its-safe-button`}
          onClick={() => nextStep()}
        >
          {t('I wrote it down')}
        </PrimaryButton>
      </span>
    </div>
  </>
);

export default withTranslation()(BackupPassphrase);
