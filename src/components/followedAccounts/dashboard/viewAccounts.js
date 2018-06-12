import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../accountVisual/index';
import LiskAmount from '../../liskAmount/index';

import styles from './followedAccounts.css';

class ViewAccounts extends React.Component {
  render() {
    return <div>
      <header><h2>Following</h2></header>

      <div className={styles.accounts}>
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
              <div className={styles.balance}>
                <LiskAmount val={account.balance} /> <span>LSK</span>
              </div>
              <div className={styles.title}>{account.name}</div>
            </div>
          </div>))}
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  accounts: [
    { address: '16313739661670634666L', balance: '9967542290836600', name: '16313739661670634666L' },
    { address: '537318935439898807L', balance: '0', name: '537318935439898807L' }],
});

export default connect(mapStateToProps)(translate()(ViewAccounts));
