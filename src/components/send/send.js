import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import Form from './steps/form';
import Confirm from './steps/confirm';
import FollowAccount from '../sendTo/followAccount';
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

  goToWallet() {
    this.props.history.push('/wallet');
  }

  render() {
    const { amount, recipient, reference } = this.getSearchParams();

    return (
      <Box className={`send-box ${styles.send}`}>
        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${grid['col-xs-10']} ${grid['col-sm-10']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <MultiStep
              key='send'
              finalCallback={this.goToWallet.bind(this)}
              className={styles.wrapper}>
              <AccountInitialization
                history={this.props.history}
                address={recipient}/>
              <Form
                autoFocus={this.state.isActiveOnMobile || window.innerWidth > breakpoints.m}
                address={recipient}
                amount={amount}
                reference={reference}
                settingsUpdated={this.props.settingsUpdated}
                settings={this.props.settings}
                goToWallet={this.goToWallet.bind(this)}
              />
              <PassphraseSteps />
              <Confirm />
              <ResultBox history={this.props.history} goToWallet={this.goToWallet.bind(this)} />
              <FollowAccount showConfirmationStep={true}/>
              <ResultBox history={this.props.history} goToWallet={this.goToWallet.bind(this)}/>
            </MultiStep>
          </div>
        </div>
      </Box>
    );
  }
}

export default Send;
