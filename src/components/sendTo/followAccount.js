import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { TertiaryButton, Button } from './../toolbox/buttons/button';
import Box from '../box';
import AccountTitleInput from './../followedAccounts/accountTitleInput';
import { followedAccountAdded } from '../../actions/followedAccounts';
import Piwik from '../../utils/piwik';
import styles from './followAccount.css';

class FollowAccount extends React.Component {
  constructor() {
    super();
    this.state = { title: { value: '' } };
  }

  handleChange(value, validateInput) {
    this.setState({
      title: {
        value,
        error: validateInput(value),
      },
    });
  }

  onPrevStep() {
    Piwik.trackingEvent('FollowAccount', 'button', 'onPreviousStep');
    this.props.prevStep();
  }

  onFollowAccount() {
    Piwik.trackingEvent('FollowAccount', 'button', 'onFollowAccount');

    const { address } = this.props;
    const title = this.state.title.value;

    this.props.addAccount({ title, address });
    // istanbul ignore else
    if (!this.props.showConfirmationStep) {
      this.props.prevStep();
    } else {
      this.props.nextStep({
        success: true,
        title: this.props.t('Success'),
        body: this.props.t('{{title}} has been added to your Dashboard.', { title }),
        followedAccount: [{ address }],
        reciepientId: address,
      });
    }
  }

  render() {
    const { t } = this.props;

    return (<Box className={`${styles.wrapper}
      ${this.props.showConfirmationStep ? styles.followedAccountsStep : ''}`}>
      <header>
        <h2>{t('Add to bookmarks')}</h2>
        <p>{t('Add this account to your dashboard to keep track of its balance, and use it as a bookmark in the future.')}</p>
      </header>
      <AccountTitleInput
        title={this.state.title}
        className={styles.titleInput}
        onChange={this.handleChange.bind(this)}
      />
      <footer>
        <Button onClick={() => this.onPrevStep.bind(this)} className={`${styles.button} ${styles.follow} cancel`} >
          <span className={styles.label}>{t('Cancel')}</span>
        </Button>

        <TertiaryButton className={`${styles.button} follow-account-button`}
          disabled={!this.state.title.value || !!this.state.title.error}
          onClick={() => this.onFollowAccount.bind(this)}>
          {t('Add to list')}
        </TertiaryButton>
      </footer>
    </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
});

export default connect(null, mapDispatchToProps)(translate()(FollowAccount));
