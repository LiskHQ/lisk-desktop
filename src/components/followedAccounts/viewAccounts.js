import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import BoxV2 from '../boxV2';
import AccountVisual from '../accountVisual/index';
import LiskAmount from '../liskAmount/index';
import { FontIcon } from '../fontIcon/index';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import TitleInput from './titleInputForList';
import { followedAccountRemoved } from '../../actions/followedAccounts';
import Piwik from '../../utils/piwik';
import ShowMore from '../showMore';
import styles from './followedAccounts.css';

class ViewAccounts extends React.Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      showMore: false,
    };
  }

  onShowMoreToggle() {
    this.setState({ showMore: !this.state.showMore });
  }

  onEditAccount() {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Edit account');
    this.setState({ edit: !this.state.edit });
  }

  onFollowedAccount(account) {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Followed account');

    const { history } = this.props;
    if (!this.state.edit) history.push(`${routes.explorer.path}${routes.accounts.path}/${account.address}`);
  }

  onRemoveAccount(account) {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Remove account');
    this.props.removeAccount(account);
  }

  onAddAccount() {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Add account');
    this.props.nextStep();
  }

  render() {
    const {
      t,
      accounts,
    } = this.props;

    return (
      <BoxV2>
        <header className={`${styles.bookmarkHeader}`}>
          <h1>{t('Bookmarks')}</h1>
          {
            accounts.length > 0 &&
            (
              <div
                className={`${styles.clickable} ${styles.edit} edit-accounts`}
                onClick={() => this.setState({ edit: !this.state.edit })}
              >
              {
                !this.state.edit &&
                <span className={'add-account-button'} onClick={() => this.onAddAccount()}>Add</span>
              }
              {
                this.state.edit
                ? <span>{t('Done')}</span>
                : <span>Edit</span>
              }
              </div>
            )
          }
        </header>
        <div className={`${styles.container}`}>
        {
          accounts.length
          ? <div className={`${styles.accounts} ${this.state.showMore && styles.showMoreToggle} followed-accounts-list`}>
              <div className={styles.list}>
                {
                  accounts.map((account, i) =>
                  (<div
                    key={i}
                    className={`${grid.row} ${styles.rows} ${styles.clickable} followed-account`}
                    onClick={() => this.onFollowedAccount(account)}
                  >
                    <div className={`${styles.leftText} ${grid['col-md-2']}`}>
                      <AccountVisual
                        className={styles.accountVisual}
                        address={account.address}
                        size={43}
                      />
                    </div>
                    <div className={`${styles.rightText} ${styles.accountInformation} ${grid['col-md-10']}`}>
                      <div className={this.state.edit ? styles.editMode : null}>
                        <div className={`${styles.balance} followed-account-balance`}>
                          <LiskAmount val={account.balance} /> <span>LSK</span>
                        </div>
                        <TitleInput
                          key={account.address}
                          edit={this.state.edit}
                          account={{
                            title: account.title || account.address,
                            address: account.address,
                            balance: account.balance,
                          }}
                        />
                      </div>
                      {
                        this.state.edit
                        ? <div className={`${styles.removeAccount} remove-account`}
                            onClick={() => this.onRemoveAccount(account)}>
                            <FontIcon value='remove'/>
                          </div>
                        : null
                      }
                    </div>
                  </div>))
                }
                {
                  !accounts.length &&
                  (
                    <div className={`${styles.addAccountLink} ${styles.rows} ${styles.clickable} add-account-button`} onClick={() => this.onAddAccount()}>
                      {t('Add a Lisk ID')} <FontIcon value='arrow-right'/>
                    </div>
                  )
                }
              </div>
            </div>
          : <div className={`${styles.emptyList} followed-accounts-empty-list`}>
              <p>{t('Keep track of any Lisk ID balance. Only you will see who you bookmarked.')}</p>

              <div className={`${styles.addBookmarkBtn} add-account-button`} onClick={() => this.onAddAccount()}>
                <PrimaryButtonV2>{t('Add a Lisk ID to follow')}</PrimaryButtonV2>
              </div>
            </div>
        }
        </div>
        {
          accounts.length > 4 &&
          <ShowMore
            className={`${styles.showMore} show-more`}
            onClick={() => this.onShowMoreToggle()}
            text={ this.state.showMore ? t('Show Less') : t('Show More')}
          />
        }
    </BoxV2>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  removeAccount: data => dispatch(followedAccountRemoved(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ViewAccounts));
