import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../accountVisual/index';
import LiskAmount from '../../liskAmount/index';
import { FontIcon } from '../../fontIcon';
import styles from './followedAccounts.css';
import routes from './../../../constants/routes';

class ViewAccounts extends React.Component {
  render() {
    const {
      t, accounts, history, nextStep,
    } = this.props;

    return <div>
      <header><h2>{t('Following')}</h2></header>
        {accounts.length
          ? <div className={`${styles.accounts} followed-accounts-list`}>
              <div className={styles.list}>
                {accounts.map((account, i) =>
                (<div
                  key={i}
                  className={`${grid.row} ${styles.rows} ${styles.clickable} followed-account`}
                  onClick={() => history.push(`${routes.explorer.path}${routes.accounts.path}/${account.address}`)}
                >
                  <div className={`${styles.leftText} ${grid['col-md-3']}`}>
                    <AccountVisual
                      className={styles.accountVisual}
                      address={account.address}
                      size={43}
                    />
                  </div>
                  <div className={`${styles.rightText} ${styles.accountInformation} ${grid['col-md-9']}`}>
                    <div>
                      <div className={styles.balance}>
                        <LiskAmount val={account.balance} /> <span>LSK</span>
                      </div>
                      <div className={`${styles.title} account-title`}>{account.title || account.address}</div>
                    </div>
                  </div>
                </div>))
                }
                <div className={`${styles.addAccountLink} ${styles.rows} ${styles.clickable} add-account-button`} onClick={() => nextStep()}>
                  {t('Add a Lisk ID')} <FontIcon value='arrow-right'/>
                </div>
              </div>
            </div>
          : <div className={`${styles.emptyList} followed-accounts-empty-list`}>
              <p>{t('Keep track of any Lisk ID balance. Only you will see who you follow.')}</p>

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

export default connect(mapStateToProps)(translate()(ViewAccounts));
