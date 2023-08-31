import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import PassphraseBackup from '@auth/components/passphraseBackup';
import routes from 'src/routes/routes';
import registerStyles from '../Signup/register.css';

const SavePassphrase = ({ passphrase, title, prevStep, nextStep, isJsonBackup = false }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onComplete = () => {
    history.push(routes.wallet.path);
  };

  return (
    <>
      <div className={registerStyles.titleHolder}>
        <h1>{title || t('Save your secret recovery phrase')}</h1>
        <p>{t('Keep it safe as it is the only way to access your wallet.')}</p>
        <p className={registerStyles.warning}>
          <Icon name="warningYellow" />
          <span>
            {!isJsonBackup
              ? t(
                  'Writing it down manually offers greater security compared to copying and pasting the recovery phrase, or downloading the paper wallet.'
                )
              : t(
                  'Writing it down manually offers greater security compared to copying and pasting the recovery phrase.'
                )}
          </span>
        </p>
      </div>
      <div className={`${grid['col-sm-10']} ${registerStyles.passphraseBackupContainer}`}>
        <PassphraseBackup
          passphrase={passphrase}
          t={t}
          paperWalletName={isJsonBackup || 'Lisk_passphrase_store_safely'}
          jsonBackup={isJsonBackup}
        />
      </div>
      {!isJsonBackup ? (
        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <span
            className={`${registerStyles.button} ${registerStyles.backButton} ${registerStyles.savePassphraseBackButton}`}
          >
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
      ) : (
        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <span className={`${registerStyles.button} ${registerStyles.backButton}`}>
            <TertiaryButton onClick={onComplete}>{t('Back to wallet')}</TertiaryButton>
          </span>
        </div>
      )}
    </>
  );
};

export default SavePassphrase;
