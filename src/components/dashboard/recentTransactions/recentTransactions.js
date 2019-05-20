import React, { Component } from 'react';
import Box from '../../boxV3';
import styles from './recentTransactions';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.onTabClick = this.onTabClick.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onTabClick(tab) {
    console.log(tab);
  }

  render() {
    const { settings, t } = this.props;
    const activeToken = settings.token.active || 'LSK';

    return (
      <Box
        title={`Recent ${activeToken} Transactions`}
        t={t}>
        <div className={styles.wrapper}>{activeToken}</div>
      </Box>
    );
  }
}

export default RecentTransactions;
