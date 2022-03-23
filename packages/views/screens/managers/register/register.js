import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '@common/utilities/passphrase';
import { extractAddressFromPassphrase } from '@common/utilities/account';
import routes from '@screens/router/routes';
import MultiStepProgressBar from '@shared/multiStepProgressBar';
import MultiStep from '@shared/registerMultiStep';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import styles from './register.css';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      selectedAccount: {},
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  componentDidMount() {
    const passphrases = [...Array(5)].map(generatePassphrase);
    const accounts = passphrases.map(pass => ({
      address: extractAddressFromPassphrase(pass),
      passphrase: pass,
    }));
    this.setState({
      accounts,
    });
  }

  componentDidUpdate() {
    const { account, token, history } = this.props;
    if (account?.info?.[token.active].address) {
      history.push(routes.dashboard.path);
    }
  }

  /* istanbul ignore next */
  handleSelectAvatar(selectedAccount) {
    this.setState({ selectedAccount });
  }

  render() {
    const { accounts, selectedAccount } = this.state;
    return (
      <>
        <div className={`${grid.row} ${styles.register}`}>
          <MultiStep
            navStyles={{ multiStepWrapper: styles.wrapper }}
            progressBar={MultiStepProgressBar}
          >
            <ChooseAvatar
              accounts={accounts}
              selected={selectedAccount}
              handleSelectAvatar={this.handleSelectAvatar}
            />
            <BackupPassphrase
              account={selectedAccount}
            />
            <ConfirmPassphrase
              account={selectedAccount}
              passphrase={selectedAccount.passphrase}
            />
            <AccountCreated
              account={selectedAccount}
            />
          </MultiStep>
        </div>
      </>
    );
  }
}

export default Register;
