import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { tokenKeys } from '@token/fungible/consts/tokens';
import { selectActiveTokenAccount } from '@common/store';
import RequestLsk from './requestLsk';

const Request = ({
  account, t,
}) => {
  const address = account.info ? account.summary.address : '';
  return <RequestLsk address={address} t={t} />;
};

Request.propTypes = {
  account: PropTypes.object,
  token: PropTypes.oneOf(tokenKeys).isRequired,
  t: PropTypes.func.isRequired,
};

Request.defaultProps = {
  account: {},
  token: 'LSK',
  /* istanbul ignore next */
  t: key => key,
};

export default connect(
  state => ({
    account: selectActiveTokenAccount(state),
  }),
  {},
)(withTranslation()(Request));
