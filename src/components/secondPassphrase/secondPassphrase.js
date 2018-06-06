import React from 'react';
// import Fees from '../../constants/fees';
import MultiStep from '../multiStep';
// import Info from '../passphrase/info';
import CreateSecond from '../passphrase/createSecond';
import Safekeeping from '../passphrase/safekeeping';
import Confirm from '../passphrase/confirm';
import Box from '../box';
import styles from './secondPassphrase.css';
import routes from '../../constants/routes';

class SecondPassphrase extends React.Component {
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
    const {
      account, peers, registerSecondPassphrase, t,
    } = this.props;
    const header = t('Secure the use of your Lisk ID with a second passphrase.');
    const message = t('You will need it to use your Lisk ID, like sending and voting. You are responsible for keeping your second passphrase safe. No one can restore it, not even Lisk.');
    const onPassphraseRegister = (secondPassphrase, passphrase) => {
      /* istanbul ignore next */
      registerSecondPassphrase({
        activePeer: peers.data,
        secondPassphrase,
        passphrase,
        account,
      });
    };
    return (
      <Box className={`${styles.hasPaddingTop} ${styles.register}`}>
        <MultiStep
          showNav={true}
          finalCallback={onPassphraseRegister}
          backButtonLabel={t('Back')}
          prevPage={this.backToPreviousPage.bind(this)}
        >
          <CreateSecond title={t('Create')} t={t} icon='add' balance={account.balance} />
          <Safekeeping title={t('Safekeeping')} t={t} step='revealing-step'
            icon='checkmark' header={header} message={message} />
          <Confirm title={t('Confirm')} t={t} confirmButton='Register'
            icon='login' secondPassConfirmation={true} />
        </MultiStep>
      </Box>);
  }
}

export default SecondPassphrase;
