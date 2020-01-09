import React from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Dialog from '../../toolbox/dialog/dialog';
import FlashMessageHolder from '../../toolbox/flashMessage/holder';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons/button';
import externalLinks from '../../../constants/externalLinks';
import styles from './analyticsDialog.css';

class AnalyticsDialog extends React.Component {
  constructor() {
    super();

    this.handleClickAccept = this.handleClickAccept.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
  }

  handleClickAccept() {
    const { settingsUpdated, t } = this.props;
    settingsUpdated({ statistics: true });
    toast.info(t('Settings saved!'));
    FlashMessageHolder.deleteMessage('Analytics');
  }

  handleClickCancel() {
    this.props.settingsUpdated({ statisticsFollowingDay: moment().format('YYYY-MM-DD') });
    FlashMessageHolder.deleteMessage('Analytics');
  }

  render() {
    const { t } = this.props;

    return (
      <Dialog hasClose>
        <Dialog.Title>
          {t('Anonymous Data Collection')}
        </Dialog.Title>
        <Dialog.Description>
          <p>
            {
              t('We would like to request permission for collecting anonymous data in order to improve our UI products. The data will be stored in our servers however, it will not include sensitive information related to your Lisk Account.')
            }
          </p>
        </Dialog.Description>
        <Dialog.Description>
          <p>
            { `${t('You can learn more in our')} ` }
            <a
              target="_blank"
              href={externalLinks.privacyPolicy}
            >
              {t('Privacy Policy')}
            </a>
          </p>
        </Dialog.Description>

        <Dialog.Options align="center">
          <SecondaryButton onClick={this.handleClickCancel} className={[styles.buttons, 'cancel-button'].join(' ')}>
            {t('Cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleClickAccept} className={styles.buttons}>
            {t('Accept')}
          </PrimaryButton>
        </Dialog.Options>
      </Dialog>
    );
  }
}

AnalyticsDialog.propTypes = {
  t: PropTypes.func.isRequired,
};

export default AnalyticsDialog;
