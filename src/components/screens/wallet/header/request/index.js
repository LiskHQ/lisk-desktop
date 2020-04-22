import PropTypes from 'prop-types';
import React from 'react';

import { tokenKeys } from '../../../../../constants/tokens';
import RequestBtc from './requestBtc';
import RequestLsk from './requestLsk';

const TagNameMap = {
  LSK: RequestLsk,
  BTC: RequestBtc,
};

const Request = ({
  address, t, token,
}) => {
  const TagName = TagNameMap[token];
  return <TagName address={address} t={t} />;
};

Request.propTypes = {
  address: PropTypes.string.isRequired,
  token: PropTypes.oneOf(tokenKeys).isRequired,
  t: PropTypes.func.isRequired,
};

Request.defaultProps = {
  address: '',
  token: 'LSK',
  /* istanbul ignore next */
  t: key => key,
};

export default Request;
