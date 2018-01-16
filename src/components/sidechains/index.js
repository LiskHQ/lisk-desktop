import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Box from '../box';
import styles from './sidechains.css';

class Sidechains extends React.Component {
  render() {
    const { t } = this.props;
    return (<Box className={styles.wrapper}>
      <div className={styles.header}>
        <h2>{t('Coming soon.')}</h2>
        <div className={styles.subHeader}>{t('Register your application name in the Lisk mainchain. ' +
          'Find hosts for your sidechain in the delegate marketplace. Monitor and maintain your sidechains.')}</div>
      </div>
    </Box>);
  }
}

export default withRouter(translate()(Sidechains));

