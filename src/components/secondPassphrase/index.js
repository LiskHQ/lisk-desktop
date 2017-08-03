import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'react-toolbox/lib/menu';
import Passphrase from '../passphrase';
import { setSecondPassphrase } from '../../utils/api/account';
import { dialogDisplayed, successAlertDialogDisplayed } from '../../actions/dialog';
import styles from './secondPassphrase.css';


export const SecondPassphrase = (props) => {
  const onLoginSubmission = (secondPassphrase) => {
    setSecondPassphrase(props.peers.data, secondPassphrase, props.account.publicKey,
      props.account.passphrase)
      .then(() => {
        props.showSuccessAlert({ text: 'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.' });
      }).catch((error) => {
        const text = (error && error.message) ? error.message : 'An error occurred while registering your second passphrase. Please try again.';
        props.showSuccessAlert({ text });
      });
  };

  return (
    !props.account.secondSignature ?
      <MenuItem caption="Register second passphrase"
        onClick={() => props.setActiveDialog({
          title: 'Second Passphrase',
          childComponent: Passphrase,
          childComponentProps: {
            onPassGenerated: onLoginSubmission,
            keepModal: true,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondPassphrase);
