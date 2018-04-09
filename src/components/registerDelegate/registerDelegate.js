import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Choose from './steps/choose';
import BackgroundMaker from '../backgroundMaker';
import MultiStep from '../multiStep';
import Box from '../box';
import styles from './registerDelegate.css';

class RegisterDelegate extends React.Component {
  submitDelegate(state) {
    event.preventDefault();
    // @todo I'm not handling this part: this.setState({ nameError: error.message });
    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username: state.delegateName.value,
      passphrase: state.passphrase.value,
      secondPassphrase: state.secondPassphrase.value,
    });
  }

  signWithFirstPass(passphrase) {
    const data = {
      activePeer: this.props.peers.data,
      passphrase,
    };
    this.props.accountUpdated(data);
  }

  signWithSecondPass(passphrase) {
    const data = {
      activePeer: this.props.peers.data,
      secondPassphrase: passphrase,
    };
    this.props.accountUpdated(data);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <BackgroundMaker className={styles.background} />
        <Box className={styles.registerDelegate}>
          <MultiStep
            prevPage={this.goBack.bind(this)}
            finalCallback={this.submitDelegate.bind(this)}
            backButtonLabel={this.props.t('Back')}>
            <Choose title='Choose'
              t={this.props.t}
              signWithFirstPass={this.signWithFirstPass.bind(this)}
              signWithSecondPass={this.signWithSecondPass.bind(this)}
              submitDelegate={this.submitDelegate.bind(this)}
              icon='add' />
            <Choose title='Confirm' t={this.props.t} icon='add' />
          </MultiStep>
        </Box>
      </div>
    );
  }
}

export default withRouter(translate()(RegisterDelegate));
