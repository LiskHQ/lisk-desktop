import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
// import FontIcon from 'react-toolbox/lib/font_icon';
import React from 'react';
import { SecondaryLightButton } from '../toolbox/buttons/button';
import BackgroundMaker from '../backgroundMaker';
import { FontIcon } from '../fontIcon';
import AddAccountCard from './addAccountCard';
import styles from './savedAccounts.css';
import AccountCard from './accountCard';

class SavedAccounts extends React.Component {
  constructor() {
    super();

    this.state = {
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

  render() {
    const {
      closeDialog,
      accountSwitched,
      savedAccounts,
      history,
      t,
    } = this.props;

    const switchAccount = (account) => {
      if (!this.state.editing) {
        accountSwitched(account);
        history.push('/main/dashboard/');
      }
    };

    return (
      <div className={`${styles.wrapper} save-account`}>
        <BackgroundMaker className={styles.background} />
        <h1>{t('Your favorite Lisk IDs')}</h1>
        <ul className={styles.cardsWrapper} >
          <AddAccountCard t={t} />
          {
            savedAccounts.map(account =>
              <AccountCard
                key={account.publicKey + account.network}
                onClick={() => switchAccount(account)}
                handleRemove={this.handleRemove.bind(this)}
                isSelectedForRemove={this.isSelectedForRemove.bind(this)}
                selectForRemove={this.selectForRemove.bind(this)}
                account={account}
                t={t}
                isEditing={this.state.editing} />)
          }
        </ul>
        <SecondaryLightButton className='edit-button'
          onClick={this.toggleEdit.bind(this)}
          theme={{ button: styles.addAcctiveAccountButton }}>
          <FontIcon className={styles.editIcon}
            value={this.state.editing ? 'checkmark' : 'edit'} />
          {this.state.editing ? t('Done') : t('Edit')}
        </SecondaryLightButton>
        <ToolBoxButton icon={<FontIcon value='close' />} floating onClick={closeDialog} className={`x-button ${styles.closeButton}`} />
      </div>
    );
  }
}

export default SavedAccounts;
