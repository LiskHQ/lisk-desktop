import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Dialog from '../toolbox/dialog/dialog';
import { PrimaryButton, SecondaryButton } from '../toolbox/buttons/button';
import styles from './newReleaseDialog.css';

const NewReleaseDialog = ({ version, releaseNotes, t }) => (
  <Dialog hasClose>
    <Dialog.Title>
      {t('Lisk Hub {{version}} is here!', { version })}
    </Dialog.Title>
    <Dialog.Description>
      <p>{t('Would you like to download it now?')}</p>
    </Dialog.Description>

    <div className={styles.wrapper}>
      <h3>{t('Release Notes')}</h3>
      <div className={styles.releaseNotes}>
        {releaseNotes}
      </div>
    </div>

    <Dialog.Options>
      <SecondaryButton>
        {t('Remind me later')}
      </SecondaryButton>
      <PrimaryButton>
        {t('Install update')}
      </PrimaryButton>
    </Dialog.Options>
  </Dialog>
);

NewReleaseDialog.propTypes = {
  version: PropTypes.string.isRequired,
  releaseNotes: PropTypes.element.isRequired,
};

export default translate()(NewReleaseDialog);
