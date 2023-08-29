import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import PassphraseBackup from '@auth/components/passphraseBackup';
import routes from 'src/routes/routes';
import registerStyles from '../Signup/register.css';

const SavePassphrase = ({ passphrase, title, isJsonBackup = false }) => {
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
            {t(
              'Writing it down manually offers greater security compared to copying and pasting the recovery phrase.'
            )}
          </span>
        </p>
      </div>
      <div className={`${grid['col-sm-10']} ${registerStyles.passphraseBackupContainer}`}>
        <PassphraseBackup
          passphrase={passphrase}
          t={t}
          paperWalletName={isJsonBackup || 'lisk_passphrase_store_safely'}
          jsonBackup={isJsonBackup}
        />
      </div>

      <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
        <span className={`${registerStyles.button} ${registerStyles.backButton}`}>
          <TertiaryButton onClick={onComplete}>{t('Back to wallet')}</TertiaryButton>
        </span>
      </div>
    </>
  );
};

export default SavePassphrase;
