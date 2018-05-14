import React from 'react';
// import Fees from '../../constants/fees';
import MultiStep from '../multiStep';
// import Info from '../passphrase/info';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';
import Box from '../box';
import styles from './signMessage.css';

class SignMessage extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }
  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    document.body.classList.add('contentFocused');
  }

  backToPreviousPage() {
    this.props.history.goBack();
  }

  render() {
    const { account, t } = this.props;
    const header = t('Sign a message.');
    const message = t('Signing a message with this tool indicates ownership of a privateKey (secret) and provides a level of proof that you are the owner of the key.') +
      t('Its important to bear in mind that this is not a 100% proof as computer systems can be compromised, but is still an effective tool for proving ownership of a particular publicKey/address pair.') +
      t('Note: Digital Signatures and signed messages are not encrypted!');

    return (
      <Box className={`${styles.hasPaddingTop} ${styles.signMessage}`}>
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
