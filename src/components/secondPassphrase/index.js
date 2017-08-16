import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'react-toolbox/lib/menu';
import Passphrase from '../passphrase';
import { dialogDisplayed } from '../../actions/dialog';
import { secondPassphraseRegistered } from '../../actions/account';
import styles from './secondPassphrase.css';
import Fees from '../../constants/fees';

export const SecondPassphrase = ({
  account, peers, setActiveDialog, registerSecondPassphrase,
}) => {
  const onLoginSubmission = (secondPassphrase) => {
    registerSecondPassphrase({
      activePeer: peers.data,
      secondPassphrase,
      account,
    });
  };

  return (
    !account.secondSignature ?
      <MenuItem caption="Register second passphrase"
        onClick={() => setActiveDialog({
          title: 'Register second passphrase',
          childComponent: Passphrase,
          childComponentProps: {
            onPassGenerated: onLoginSubmission,
            keepModal: true,
            fee: Fees.setSecondPassphrase,
            confirmButton: 'Register',
            useCaseNote: 'your second passphrase will be required for all transactions sent from this account',
            securityNote: 'Losing access to this passphrase will mean no funds can be sent from this account.',
          },
        })}/> : <li className={`empty-template ${styles.hidden}`}></li>
  );
};

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  registerSecondPassphrase: data => dispatch(secondPassphraseRegistered(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondPassphrase);
