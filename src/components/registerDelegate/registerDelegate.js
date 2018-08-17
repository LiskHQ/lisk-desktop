import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PassphraseSteps from './../passphraseSteps';
import Choose from './steps/choose';
import Confirm from './steps/confirm';
import MultiStep from '../multiStep';
import Box from '../box';
import styles from './registerDelegate.css';
import passphraseStyles from './steps/passphraseSteps.css';

class RegisterDelegate extends React.Component {
  submitDelegate({ delegateName, passphrase, secondPassphrase }) {
    this.props.delegateRegistered({
      account: this.props.account,
      username: delegateName,
      passphrase: passphrase.value,
      secondPassphrase: secondPassphrase.value,
    });
  }

  checkDelegateUsernameAvailable(username) {
    const data = {
      username,
    };
    this.props.delegatesFetched(data);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const passphraseValues = {
      columns: { xs: 6, sm: 6, md: 2 },
      passphrase: {
        header: this.props.t('Please sign in with your passphrase'),
      },
      secondPassphrase: {
        header: this.props.t('Please sign in with your second passphrase'),
      },
      footer: {
        firstGrid: passphraseStyles.firstGrid,
        secondGrid: grid['col-xs-12'],
      },
    };

    return (
      <Box className={styles.registerDelegate}>
        <section className={`${grid.row} ${grid['center-xs']}`}>
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
        </section>
      </Box>
    );
  }
}

export default withRouter(translate()(RegisterDelegate));
