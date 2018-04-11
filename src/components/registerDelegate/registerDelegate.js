import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import PassphraseSteps from './../passphraseSteps';
import Choose from './steps/choose';
import Confirm from './steps/confirm';
import BackgroundMaker from '../backgroundMaker';
import MultiStep from '../multiStep';
import Box from '../box';
import styles from './registerDelegate.css';
import passphraseStyles from './steps/passphraseSteps.css';

class RegisterDelegate extends React.Component {
  submitDelegate({ delegateName, passphrase, secondPassphrase }) {
    event.preventDefault();

    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username: delegateName,
      passphrase: passphrase.value,
      secondPassphrase: `${secondPassphrase.value}-notValid`, // TODO: remove
    });
  }

  checkDelegateUsernameAvailable(username) {
    const data = {
      activePeer: this.props.peers.data,
      username,
    };
    this.props.delegatesFetched(data);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const passphraseValues = {
      columns: { xs: 2, sm: 2, md: 2 },
      passphrase: {
        header: this.props.t('Please sign in with your 1st passphrase'),
      },
      secondPassphrase: {
        header: this.props.t('Please sign in with your 2nd passphrase'),
      },
    };

    return (
      <div className={styles.wrapper}>
        <BackgroundMaker className={styles.background} />
        <Box className={styles.registerDelegate}>
          <MultiStep
            className={styles.multiStep}
            prevPage={this.goBack.bind(this)}
            finalCallback={this.submitDelegate.bind(this)}
            backButtonLabel={this.props.t('Back')}>
            <Choose
              title={this.props.t('Choose')}
              t={this.props.t}
              checkDelegateUsernameAvailable={this.checkDelegateUsernameAvailable.bind(this)}
              icon='add' />
            <PassphraseSteps styles={passphraseStyles} values={passphraseValues} title={this.props.t('Safekeeping')} icon='add' />
            <Confirm
              title={this.props.t('Confirm')}
              icon='login'
              t={this.props.t}
              submitDelegate={this.submitDelegate.bind(this)} />
          </MultiStep>
        </Box>
      </div>
    );
  }
}

export default withRouter(translate()(RegisterDelegate));
