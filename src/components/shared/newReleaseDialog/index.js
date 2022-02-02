import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Dialog from '@toolbox/dialog/dialog';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import styles from './newReleaseDialog.css';

const NewReleaseDialog = ({ t }) => {
  const { version, releaseNotes, ipc } = useSelector(state => state.appUpdates);
  const handleClick = () => {
    FlashMessageHolder.deleteMessage('NewRelease');
    ipc.send('update:started');
  };

  // return !!ipc && (
  return (
    <Dialog hasClose>
      <div className={styles.wrapper}>
        <Dialog.Title>
          {t('Lisk {{version}} is here!', { version })}
        </Dialog.Title>
        <Dialog.Description>
          <p>{t('Would you like to download it now?')}</p>
        </Dialog.Description>
        <h3>{t('Release notes')}</h3>
        <div className={styles.releaseNotes}>
          {releaseNotes}
        </div>
      </div>
      <Dialog.Options align="center">
        <SecondaryButton onClick={() => FlashMessageHolder.deleteMessage('NewRelease')}>
          {t('Remind me later')}
        </SecondaryButton>
        <PrimaryButton onClick={handleClick}>
          {t('Install update')}
        </PrimaryButton>
      </Dialog.Options>
    </Dialog>
  );
};

export default withTranslation()(NewReleaseDialog);
