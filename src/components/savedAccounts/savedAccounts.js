import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import React from 'react';
import { SecondaryLightButton } from '../toolbox/buttons/button';
import BackgroundMaker from '../backgroundMaker';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import AddAccountCard from './addAccountCard';
import AccountCard from './accountCard';
import styles from './savedAccounts.css';


class SavedAccounts extends React.Component {
  constructor() {
    super();

    this.state = {
      isSecureAppears: {},
    };
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing,
      accountSelectedForRemove: null,
    });
  }

  selectForRemove(account) {
    this.setState({ accountSelectedForRemove: account });
  }

  isSelectedForRemove(account) {
    const { publicKey, network, address } = this.state.accountSelectedForRemove || {};
    return (account.publicKey === publicKey &&
      account.network === network &&
      account.address === address);
  }

  handleRemove(account, e) {
    if (this.isSelectedForRemove(account)) {
      this.props.accountRemoved(account);
    } else {
      this.selectForRemove(account);
    }
    e.stopPropagation();
  }

  handleRemovePassphrase(account, e) {
    e.stopPropagation();

    const uniqueID = `${account.network}${account.publicKey}`;
    const { savedAccounts } = this.props;
    const savedActiveAccount = savedAccounts.find(acc => `${acc.network}${acc.passphrase}` === `${account.network}${account.passphrase}`);
    if (savedActiveAccount) {
      this.props.removePassphrase(account);
    }

    this.props.removeSavedAccountPassphrase(account);

    this.setState({ isSecureAppears: { ...this.state.isSecureAppears, [uniqueID]: true } });
    setTimeout(() => {
      this.setState({ isSecureAppears: { ...this.state.isSecureAppears, [uniqueID]: false } });
    }, 5000);
  }

  render() {
    const {
      accountSwitched,
      savedAccounts,
      history,
      t,
    } = this.props;

    const goToDashboard = () => {
      history.push(`${routes.dashboard.path}`);
    };

    const goBack = () => {
      if (history.length <= 2) {
        goToDashboard();
        return;
      }
      history.goBack();
    };

    const switchAccount = (account) => {
      if (!this.state.editing) {
        accountSwitched(account);
        goToDashboard();
      }
    };

    return (
      <div className={`${styles.wrapper} save-account`}>
        <BackgroundMaker className={styles.background} />
        <h1>
          {t('Your Lisk IDs')}
        </h1>
        <div className={`${styles.content}`}>
          <ul className={styles.cardsWrapper} >
            <AddAccountCard t={t} />
            {savedAccounts.map((account, key) => (
              <AccountCard
                key={key}
                onClick={() => switchAccount(account)}
                handleRemove={this.handleRemove.bind(this)}
                isSelectedForRemove={this.isSelectedForRemove.bind(this)}
                selectForRemove={this.selectForRemove.bind(this)}
                handleRemovePassphrase={this.handleRemovePassphrase.bind(this)}
                account={account}
                isSecureAppears={this.state.isSecureAppears}
                t={t}
                isEditing={this.state.editing} />
            ))}
          </ul>
        </div>
        <SecondaryLightButton className='edit-button'
          onClick={this.toggleEdit.bind(this)}
          theme={{ button: styles.addAcctiveAccountButton }}>
          <FontIcon className={styles.editIcon}
            value={this.state.editing ? 'checkmark' : 'edit'} />
          {this.state.editing ? t('Done') : t('Edit')}
        </SecondaryLightButton>
        <ToolBoxButton icon={<FontIcon value='close' />} floating onClick={goBack} className={`x-button ${styles.closeButton}`} />
      </div>
    );
  }
}

export default SavedAccounts;
