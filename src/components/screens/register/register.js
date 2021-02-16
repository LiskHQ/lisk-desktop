import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/account';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import routes from '../../../constants/routes';
import styles from './register.css';
import MultiStep from '../../../../libs/multiStep';
import MultiStepProgressBar from '../../shared/multiStepProgressBar';
import Icon from '../../toolbox/icon';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      selectedAccount: {},
      showWarning: false,
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
    this.onConfirmPassphrase = this.onConfirmPassphrase.bind(this);
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

  onConfirmPassphrase() {
    this.setState({ showWarning: true });
  }

  render() {
    const { accounts, selectedAccount, showWarning } = this.state;
    return (
      <>
        <div className={`${grid.row} ${styles.register} ${showWarning ? styles.alignStart : ''}`}>
          {showWarning && (
            <Box>
              <BoxContent className={styles.warning}>
                <span className={styles.warningIcon}>
                  <Icon name="warningYellow" width="24px" />
                </span>
                <div className={styles.warningContent}>
                  <p className={styles.warningSubheading}>
                     WARNING: Do not deposit large amounts until your account has been initialized
                  </p>
                  <p className={styles.warningPara}>
                    To initialize your account, you simply need to send at least one
                    outgoing transaction.
                  </p>
                  <p className={styles.warningPara}>
                    Upon making your first deposit, Lisk Desktop will prompt you to send such an
                    outgoing transaction, costing only 0.1 LSK in fees. Once you have sent
                    this transaction, your account will be initialized.
                  </p>
                  <p className={styles.warningPara}>
                    If you do not initialize your account, then your account will remain vulnerable
                    to address collision attacks and at risk of being compromised.
                  </p>
                  <p className={styles.warningPara}>
                    Please read the following
                    {' '}
                    <a href="https://lisk.io/blog/announcement/lisk-account-initialization" target="_blank">
                        blog post
                      {' '}
                      <Icon name="linkIcon" />
                    </a>
                    {' '}
                    for more information.
                  </p>
                </div>
              </BoxContent>
            </Box>
          )}
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
              onConfirmPassphrase={this.onConfirmPassphrase}
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
