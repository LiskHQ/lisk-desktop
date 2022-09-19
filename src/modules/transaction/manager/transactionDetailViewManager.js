/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount, selectActiveToken } from 'src/redux/selectors';
import { getTransaction } from '@transaction/api';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import TransactionDetails from '../components/TransactionDetailsView';

const WrappedInDialog = (props) => (
  <TransactionDetails {...props} title="Transaction details" />
);

const mapStateToProps = (state, ownProps) => ({
  account: selectActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: selectActiveToken(state),
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      transactionId: parseSearchParams(ownProps.location.search).transactionId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(WrappedInDialog);
