import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import Header from '../header/index';
import MultiStep from '../multiStep';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import routes from '../../constants/routes';
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
      address: extractAddress(pass),
      passphrase: pass,
    }));
    this.setState({
      accounts,
    });
  }

  componentDidUpdate() {
    const { account, token, history } = this.props;
    if (account && account.info && account.info[token.active].address) {
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
      <React.Fragment>
        <Header showSettings />
        <div className={`${styles.register} ${grid.row}`}>
          <MultiStep
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}
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
      </React.Fragment>
    );
  }
}

export default Register;
