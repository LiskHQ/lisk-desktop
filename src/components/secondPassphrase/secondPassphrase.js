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
        .push(`${routes.main.path}${routes.dashboard.path}`);
    }
  }
  render() {
    const { account, peers, registerSecondPassphrase, t } = this.props;
    const onPassphraseRegister = (secondPassphrase, passphrase) => {
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
          backButtonLabel={t('Back')}>
          <CreateSecond title={t('Create')} t={t} icon='add' />
          <Safekeeping title={t('Safekeeping')} t={t} icon='checkmark' />
          <Confirm title={t('Confirm')} t={t} confirmButton='Register'
            icon='login' secondPassConfirmation={true} />
        </MultiStep>
      </Box>);
  }
}

export default SecondPassphrase;
