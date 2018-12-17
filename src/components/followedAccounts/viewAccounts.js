import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../accountVisual/index';
import LiskAmount from '../liskAmount/index';
import { FontIcon } from '../fontIcon/index';
import styles from './followedAccounts.css';
import routes from '../../constants/routes';
import TitleInput from './titleInputForList';
import { followedAccountRemoved } from '../../actions/followedAccounts';

class ViewAccounts extends React.Component {
  constructor() {
    super();
    this.state = { edit: false };
  }

  render() {
    const {
      t, accounts, history, nextStep, removeAccount,
    } = this.props;

    return <div>
      <header><h2>
        {t('Bookmarks')}
        {accounts.length > 0
          ? <div className={`${styles.clickable} ${styles.edit} edit-accounts`}
            onClick={() => this.setState({ edit: !this.state.edit })}>
            {this.state.edit ? <span>{t('Done')}</span> : <FontIcon value='edit'/>}
          </div>
          : null
        }
      </h2></header>
      {accounts.length
        ? <div className={`${styles.accounts} followed-accounts-list`}>
          <div className={styles.list}>
            {accounts.map((account, i) =>
              (<div
                key={i}
                className={`${grid.row} ${styles.rows} ${styles.clickable} followed-account`}
                onClick={() => {
                  if (!this.state.edit) history.push(`${routes.explorer.path}${routes.accounts.path}/${account.address}`);
                }}
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
                  {this.state.edit
                    ? <div className={`${styles.removeAccount} remove-account`}
                      onClick={() => removeAccount(account) }>
                      <FontIcon value='remove'/>
                    </div>
                    : null
                  }
                </div>
              </div>))
            }
            <div className={`${styles.addAccountLink} ${styles.rows} ${styles.clickable} add-account-button`} onClick={() => nextStep()}>
              {t('Add a Lisk ID')} <FontIcon value='arrow-right'/>
            </div>
          </div>
        </div>
        : <div className={`${styles.emptyList} followed-accounts-empty-list`}>
          <p>{t('Keep track of any Lisk ID balance. Only you will see who you bookmarked.')}</p>

          <div className={`${styles.addAccountLink} ${styles.clickable} add-account-button`} onClick={() => nextStep()}>
            {t('Add a Lisk ID')} <FontIcon value='arrow-right'/>
          </div>
        </div>
      }
    </div>;
  }
}

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  removeAccount: data => dispatch(followedAccountRemoved(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ViewAccounts));
