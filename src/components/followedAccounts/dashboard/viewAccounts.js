import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../accountVisual/index';
import LiskAmount from '../../liskAmount/index';
import { FontIcon } from '../../fontIcon';
import styles from './followedAccounts.css';

class ViewAccounts extends React.Component {
  render() {
    return <div>
      <header><h2>Following</h2></header>
        {this.props.accounts.length
          ? <div className={styles.accounts}>
              <div className={styles.list}>
                {this.props.accounts.map((account, i) =>
                (<div key={i} className={`${grid.row} ${styles.rows} ${styles.clickable}`}>
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
                    <div className={styles.title}>{account.name || account.address}</div>
                  </div>
                  </div>
                </div>))
                }
              </div>
              <div className={`${styles.addAccountLink} ${styles.clickable}`} onClick={() => this.props.nextStep()}>
                Add a Lisk ID <FontIcon value='arrow-right'/>
              </div>
            </div>
          : <div className={styles.emptyList}>
              <p>Keep track of any Lisk ID balance. Only you will see who you follow.</p>

              <div className={`${styles.addAccountLink} ${styles.clickable}`} onClick={() => this.props.nextStep()}>
                Add a Lisk ID <FontIcon value='arrow-right'/>
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
