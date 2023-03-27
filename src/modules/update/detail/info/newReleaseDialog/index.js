import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import htmlStringToReact from 'src/utils/htmlStringToReact';
import Dialog from 'src/theme/dialog/dialog';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import styles from './newReleaseDialog.css';

const NewReleaseDialog = ({ t }) => {
  const { version, releaseNotes, remindMeLater, updateNow } = useSelector(
    (state) => state.appUpdates
  );

  return (
    <Dialog hasClose>
      <div className={styles.wrapper}>
        <Dialog.Title>{t('Lisk {{version}} is here!', { version })}</Dialog.Title>
        <Dialog.Description>
          <p>{t('Would you like to download it now?')}</p>
        </Dialog.Description>
        <h3>{t('Release notes')}</h3>
        <div className={`${styles.releaseNotes} release-notes`}>
          {typeof releaseNotes === 'string' ? htmlStringToReact(releaseNotes) : releaseNotes}
        </div>
      </div>
      <Dialog.Options align="center">
        <SecondaryButton className="release-dialog-remind-me-later" onClick={remindMeLater}>
          {t('Remind me later')}
        </SecondaryButton>
        <PrimaryButton className="release-dialog-update-now" onClick={updateNow}>
          {t('Install update')}
        </PrimaryButton>
      </Dialog.Options>
    </Dialog>
  );
};

export default withTranslation()(NewReleaseDialog);
