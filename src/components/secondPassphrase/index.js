import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'react-toolbox/lib/menu';
import Passphrase from '../passphrase';
import { setSecondPassphrase } from '../../utils/api/account';
import { dialogDisplayed, successAlertDialogDisplayed } from '../../actions/dialog';
import { transactionAdded } from '../../actions/transactions';
import styles from './secondPassphrase.css';
import Fees from '../../constants/fees';

export const SecondPassphrase = (props) => {
  const onLoginSubmission = (secondPassphrase) => {
    setSecondPassphrase(props.peers.data, secondPassphrase, props.account.publicKey,
      props.account.passphrase)
      .then((data) => {
        props.showSuccessAlert({ text: 'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.' });
        // add to pending transactions
        props.addTransaction({
          id: data.transactionId,
          senderPublicKey: props.account.publicKey,
          senderId: props.account.address,
          amount: 0,
          fee: Fees.setSecondPassphrase,
        });
      }).catch((error) => {
        const text = (error && error.message) ? error.message : 'An error occurred while registering your second passphrase. Please try again.';
        props.showSuccessAlert({ text });
      });
  };

  return (
    !props.account.secondSignature ?
      <MenuItem caption="Register second passphrase"
        className='register-second-passphrase'
        onClick={() => props.setActiveDialog({
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
  showSuccessAlert: data => dispatch(successAlertDialogDisplayed(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondPassphrase);
