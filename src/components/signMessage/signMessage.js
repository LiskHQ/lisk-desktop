import React from 'react';
// import Fees from '../../constants/fees';
import MultiStep from '../multiStep';
// import Info from '../passphrase/info';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';
import Box from '../box';
import styles from './signMessage.css';

class SignMessage extends React.Component {
  backToPreviousPage() {
    this.props.history.goBack();
  }

  render() {
    const { account, t, history } = this.props;
    const header = t('Sign a message');
    const message = t('You can use your passphrase to encrypt a message. ' +
      'This encrypted message can prove that you are the owner of the account, ' +
      'since only your passphrase can produce it. We recommend including date & time or a specific keyword.');

    return (
      <Box className={`${styles.hasPaddingTop} ${styles.signMessage}`}>
        <MultiStep
          showNav={true}
          backButtonLabel={t('Back')}
          prevPage={this.backToPreviousPage.bind(this)}
          className={styles.signMessageContainer}
        >
          <SignMessageInput title={t('Input')} t={t}
            icon='edit' header={header} message={message} history={history} />
          <ConfirmMessage title={t('Result')} t={t} confirmButton='Register'
            icon='checkmark' secondPassConfirmation={true} account={account} />
        </MultiStep>
      </Box>);
  }
}

export default SignMessage;
