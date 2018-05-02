import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import PassphraseSteps from './../passphraseSteps';
import AccountInitialization from '../accountInitialization';
import { parseSearchParams } from './../../utils/searchParams';
import breakpoints from './../../constants/breakpoints';
import styles from './send.css';

class Send extends React.Component {
  constructor(props) {
    super(props);
    const needsAccountInit = !props.account.serverPublicKey
      && props.account.balance > 0
      && props.pendingTransactions.length === 0;

    const { amount, recipient } = this.getSearchParams();
    this.state = {
      sendIsActive: !!recipient || !!amount || needsAccountInit,
    };
  }

  getSearchParams() {
    return parseSearchParams(this.props.history.location.search);
  }

  setSendIsActive(sendIsActive) {
    this.setState({ sendIsActive });
  }

  render() {
    const { t } = this.props;
    const { amount, recipient } = this.getSearchParams();

    return (
      <Fragment>
        <span className={styles.mobileMenu}>
          <span className={`send-menu-item ${styles.mobileMenuItem}`}
            onClick={this.setSendIsActive.bind(this, true)}>
            {t('Send')}
          </span>
        </span>
        <Box className={`send-box ${styles.send} ${this.state.sendIsActive ? styles.isActive : ''}`}>
          <span className={`mobile-close-button ${styles.mobileClose}`}
            onClick={this.setSendIsActive.bind(this, false)}>
            {t('Close')} <FontIcon value='close' />
          </span>
          <MultiStep finalCallback={this.setSendIsActive.bind(this, false)}
            className={styles.wrapper}>
            <AccountInitialization address={recipient} />
            <SendWritable
              autoFocus={this.state.sendIsActive || window.innerWidth > breakpoints.m}
              address={recipient}
              amount={amount}
            />
            <PassphraseSteps />
            <SendReadable />
            <ResultBox history={this.props.history}/>
          </MultiStep>

        </Box>
      </Fragment>
    );
  }
}

export default translate()(Send);

