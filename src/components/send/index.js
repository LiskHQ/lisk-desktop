import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import Request from '../request';
import SpecifyRequest from '../request/specifyRequest';
import ConfirmRequest from '../request/confirmRequest';
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
      isActiveOnMobile: !!recipient || !!amount || needsAccountInit,
      isActiveTabSend: true,
    };
  }

  getSearchParams() {
    return parseSearchParams(this.props.history.location.search);
  }

  setActiveOnMobile({ isActiveOnMobile, isActiveTabSend = true }) {
    this.setState({ isActiveOnMobile, isActiveTabSend });
  }

  setActiveTabSend(isActiveTabSend) {
    this.setState({ isActiveTabSend });
  }

  render() {
    const { t } = this.props;
    const { amount, recipient } = this.getSearchParams();

    return (
      <Fragment>
        <span className={styles.mobileMenu}>
          <span className={`send-menu-item ${styles.mobileMenuItem}`}
            onClick={this.setActiveOnMobile.bind(this, { isActiveOnMobile: true })}>
            {t('Send')}
          </span>
          <span className={`request-menu-item ${styles.mobileMenuItem}`}
            onClick={this.setActiveOnMobile.bind(
this,
              { isActiveOnMobile: true, isActiveTabSend: false },
)
            }>
            {t('Request')}
          </span>
        </span>
        <Box className={`send-box ${styles.send} ${this.state.isActiveOnMobile ? styles.isActive : ''}`}>
          <span className={`mobile-close-button ${styles.mobileClose}`}
            onClick={this.setActiveOnMobile.bind(this, { isActiveOnMobile: false })}>
            {t('Close')} <FontIcon value='close' />
          </span>
          {this.state.isActiveTabSend
            ?
            <MultiStep
              key='send'
              finalCallback={this.setActiveOnMobile.bind(this, { isActiveOnMobile: false })}
              className={styles.wrapper}>
              <AccountInitialization address={recipient}/>
              <SendWritable
                autoFocus={this.state.isActiveOnMobile || window.innerWidth > breakpoints.m}
                address={recipient}
                amount={amount}
                setTabSend={this.setActiveTabSend.bind(this)}
              />
              <PassphraseSteps/>
              <SendReadable/>
              <ResultBox history={this.props.history}/>
            </MultiStep>
            :
            <MultiStep
              key='request'
              finalCallback={this.setActiveOnMobile.bind(this, { isActiveOnMobile: false })}
              className={styles.wrapper}>
              <Request {...this.props} setTabSend={this.setActiveTabSend.bind(this)} />
              <SpecifyRequest {...this.props} />
              <ConfirmRequest {...this.props} />
            </MultiStep>
          }
        </Box>
      </Fragment>
    );
  }
}

export default translate()(Send);

