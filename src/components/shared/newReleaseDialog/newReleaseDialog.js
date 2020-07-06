import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Dialog from '../../toolbox/dialog/dialog';
import FlashMessageHolder from '../../toolbox/flashMessage/holder';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons';
import styles from './newReleaseDialog.css';

class NewReleaseDialog extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { ipc } = this.props;
    FlashMessageHolder.deleteMessage('NewRelease');
    ipc.send('update:started');
  }

  render() {
    const {
      version,
      releaseNotes,
      ipc,
      t,
    } = this.props;
    return !!ipc && (
      <Dialog hasClose>
        <Dialog.Title>
          {t('Lisk {{version}} is here!', { version })}
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
          <SecondaryButton onClick={() => FlashMessageHolder.deleteMessage('NewRelease')}>
            {t('Remind me later')}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleClick}>
            {t('Install update')}
          </PrimaryButton>
        </Dialog.Options>
      </Dialog>
    );
  }
}

NewReleaseDialog.propTypes = {
  version: PropTypes.string.isRequired,
  releaseNotes: PropTypes.element.isRequired,
  ipc: PropTypes.shape({
    send: PropTypes.func.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(NewReleaseDialog);
