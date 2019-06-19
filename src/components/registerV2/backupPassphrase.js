import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import PassphraseBackup from '../passphraseBackup';
import registerStyles from './registerV2.css';

const BackupPassphrase = ({
  t, account, prevStep, nextStep,
}) => (
  <React.Fragment>
    <span className={`${registerStyles.stepsLabel}`}>{t('Step 2 / 4')}</span>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Save your Passphrase')}
      </h1>
      <p>{t('Your passphrase is your login and password combined.')}</p>
      <p>{
        t('Keep it safe as it is the only way to access your wallet.')
      }</p>
    </div>
    <div className={grid['col-sm-10']}>
      <PassphraseBackup account={account} t={t} paperWalletName='lisk_passphrase' />
    </div>

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <span className={`${registerStyles.button} ${registerStyles.backButton}`}>
        <TertiaryButtonV2 onClick={prevStep}>
          {t('Go Back')}
        </TertiaryButtonV2>
      </span>
      <span className={`${registerStyles.button}`}>
        <PrimaryButtonV2
          className={'yes-its-safe-button'}
          onClick={nextStep}>
          {t('Continue')}
        </PrimaryButtonV2>
      </span>
    </div>
  </React.Fragment>
);

export default translate()(BackupPassphrase);
