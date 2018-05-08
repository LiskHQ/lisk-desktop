import React from 'react';
// import Fees from '../../constants/fees';
import MultiStep from '../multiStep';
// import Info from '../passphrase/info';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';
import Box from '../box';
import styles from './signMessage.css';
import routes from '../../constants/routes';

class SignMessage extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }
  componentDidMount() {
    document.body.classList.add('contentFocused');
    if (this.props.account.secondSignature === 1) {
      this.props.history
        .push(`${routes.dashboard.path}`);
    }
  }

  backToPreviousPage() {
    this.props.history.goBack();
  }

  render() {
    const { account, t } = this.props;
    const header = t('Sign a message.');
    const message = t('You will need it to use your Lisk ID, like sending and voting. You are responsible for keeping your second passphrase safe. No one can restore it, not even Lisk.');

    return (
      <Box className={`${styles.hasPaddingTop} ${styles.register}`}>
        <MultiStep
          showNav={true}
          backButtonLabel={t('Back')}
          prevPage={this.backToPreviousPage.bind(this)}
        >
          <SignMessageInput title={t('Input')} t={t}
            icon='edit' header={header} message={message} />
          <ConfirmMessage title={t('Result')} t={t} confirmButton='Register'
            icon='checkmark' secondPassConfirmation={true} account={account} />
        </MultiStep>
      </Box>);
  }
}

export default SignMessage;
