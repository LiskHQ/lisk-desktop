import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { tokenKeys } from '@token/fungible/consts/tokens';
import RequestBtc from './requestBtc';
import RequestLsk from './requestLsk';

const TagNameMap = {
  LSK: RequestLsk,
  BTC: RequestBtc,
};

const Request = ({
  account, t, token,
}) => {
  const TagName = TagNameMap[token];
  const address = account.info ? account.info[token].summary.address : '';
  return <TagName address={address} t={t} />;
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
    token: state.token.active,
    account: state.wallet,
  }),
  {},
)(withTranslation()(Request));
