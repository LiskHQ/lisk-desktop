import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import HeaderV2 from '../headerV2/headerV2';
import MultiStep from '../multiStep';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import styles from './registerV2.css';

class RegisterV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      selectedAccount: {},
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  componentDidMount() {
    /* istanbul ignore next */
    const crypotObj = window.crypto || window.msCrypto;
    const passphrases = [...Array(5)].map(() =>
      generatePassphrase({
        seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
      }));
    const accounts = passphrases.map(pass => ({
      address: extractAddress(pass),
      passphrase: pass,
    }));
    this.setState({
      accounts,
    });
  }

  handleSelectAvatar(selectedAccount) {
    this.setState({
      selectedAccount,
    });
  }

  render() {
    const { accounts, selectedAccount } = this.state;
    return (
      <React.Fragment>
        <HeaderV2 showSettings={false} />
        <div className={`${styles.register} ${grid.row}`}>
          <MultiStep
            className={`${styles.wrapper} ${grid['col-sm-12']} ${grid['col-md-10']} ${grid['col-md-8']}`}
            finalCallback={() => null}>
            <ChooseAvatar
              accounts={accounts}
              selected={selectedAccount}
              handleSelectAvatar={this.handleSelectAvatar} />
            <BackupPassphrase
              account={selectedAccount} />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterV2;
