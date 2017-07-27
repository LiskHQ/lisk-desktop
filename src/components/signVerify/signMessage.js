import React from 'react';
import { connect } from 'react-redux';
import { successToastDisplayed } from '../../actions/toaster';
import SignMessageComponent from './signMessageComponent';

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
});

export default connect(
  null,
  mapDispatchToProps,
)(SignMessageComponent);
