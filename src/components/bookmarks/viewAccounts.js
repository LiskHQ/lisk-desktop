import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import AccountVisual from '../accountVisual/index';
import { FontIcon } from '../fontIcon/index';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import TitleInput from './titleInputForList';
import { bookmarkRemoved } from '../../actions/bookmarks';
import { flattenBookmarks } from '../../utils/bookmarks';
import Piwik from '../../utils/piwik';
import ShowMore from '../showMore';
import styles from './bookmarks.css';
import { getTokenFromAddress } from '../../utils/api/transactions';

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

  onBookmark(account) {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Bookmark');

    const { history } = this.props;
    if (!this.state.edit) history.push(`${routes.explorer.path}${routes.accounts.path}/${account.address}`);
  }

  onRemoveAccount(account) {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Remove account');
    const address = account.address;
    const token = getTokenFromAddress(address);
    this.props.bookmarkRemoved({ address, token });
  }

  onAddAccount() {
    Piwik.trackingEvent('ViewAccounts', 'button', 'Add account');
    this.props.nextStep();
  }

  render() {
    const {
      t,
      bookmarks,
    } = this.props;

    const accounts = flattenBookmarks(bookmarks);
    const showBar = accounts.length > 4;

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
          ? <div className={`${styles.accounts} ${showBar ? styles.onShowBar : ''} ${this.state.showMore ? styles.showMoreToggle : ''} followed-accounts-list`}>
              <div className={styles.list}>
                {
                  accounts.map((account, i) =>
                  (<div
                    key={i}
                    className={`${styles.rows} ${styles.clickable} followed-account`}
                    onClick={() => this.onBookmark(account)}
                  >
                    <div className={''}>
                      <AccountVisual
                        className={styles.accountVisual}
                        address={account.address}
                        size={35}/>
                    </div>

                    <div className={`${styles.accountInformation}`}>
                      <div className={this.state.edit ? styles.editMode : ''}>
                        <div className={`${styles.balance} followed-account-balance`}>
                          <span>{account.address}</span>
                        </div>
                        <TitleInput
                          key={account.address}
                          edit={this.state.edit}
                          account={{
                            title: account.title || account.address,
                            address: account.address,
                            isDelegate: account.isDelegate,
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
        {
          accounts.length > 4
          ? <ShowMore
              className={`${styles.showMore} show-more`}
              onClick={() => this.onShowMoreToggle()}
              text={ this.state.showMore ? t('Show Less') : t('Show More')}
            />
          : null
        }
        </div>
    </BoxV2>
    );
  }
}

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

const mapDispatchToProps = {
  bookmarkRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ViewAccounts));
