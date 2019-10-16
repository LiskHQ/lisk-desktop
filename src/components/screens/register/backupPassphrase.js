import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import PassphraseBackup from '../../shared/passphraseBackup';
import registerStyles from './register.css';

const BackupPassphrase = ({
  t, account, prevStep, nextStep,
}) => (
  <React.Fragment>
    <span className={`${registerStyles.stepsLabel}`}>
      {t('Step {{current}} / {{total}}', { current: 2, total: 4 })}
    </span>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Save your passphrase')}
      </h1>
      <p>{t('Keep it safe as it is the only way to access your wallet.')}</p>
    </div>
    <div className={`${grid['col-sm-10']} ${registerStyles.PassphraseBackupContainer}`}>
      <PassphraseBackup
        subHeader={t('Please carefully write down these 12 words and store them in a safe place.')}
        account={account}
        t={t}
        paperWalletName="lisk_passphrase"
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
  </React.Fragment>
);

export default withTranslation()(BackupPassphrase);
