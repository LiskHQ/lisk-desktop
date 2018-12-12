import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

// import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import Form from '../send/steps/form';
import Confirm from '../send/steps/confirm';
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

  setActiveOnMobile({ isActiveOnMobile, isActiveTabSend = true }) {
    this.setState({ isActiveOnMobile, isActiveTabSend });
  }

  setActiveTabSend(isActiveTabSend) {
    this.setState({ isActiveTabSend });
  }

  render() {
    const { amount, recipient, reference } = this.getSearchParams();

    return (
      <Box className={`send-box ${styles.send}`}>
        <div className={`${grid.row} ${grid['center-lg']} `}>
          <MultiStep
            key='send'
            showNav={true}
            finalCallback={this.setActiveOnMobile.bind(this, { isActiveOnMobile: false })}
            className={styles.wrapper}>
            <AccountInitialization address={recipient}/>
            <Form
              autoFocus={this.state.isActiveOnMobile || window.innerWidth > breakpoints.m}
              address={recipient}
              amount={amount}
              reference={reference}
              setTabSend={this.setActiveTabSend.bind(this)}
              settingsUpdated={this.props.settingsUpdated}
              settings={this.props.settings}
            />
            <PassphraseSteps/>
            <Confirm/>
            <ResultBox history={this.props.history}/>
            <FollowAccount showConfirmationStep={true}/>
            <ResultBox history={this.props.history}/>
          </MultiStep>
        </div>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(Send));

