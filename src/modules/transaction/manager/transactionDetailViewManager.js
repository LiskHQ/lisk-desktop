/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { getActiveTokenAccount } from '@wallet/utils/account';
import { getTransaction } from '@transaction/api';
import withData from 'src/utils/withData';
import Dialog from '@theme/dialog/dialog';
import { parseSearchParams } from 'src/utils/searchParams';
import { withTranslation } from 'react-i18next';
import { selectActiveToken } from '@common/store';
import TransactionDetails from '../components/TransactionDetailsView';

const WrappedInDialog = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
    <TransactionDetails {...props} title="Transaction details" />
  </Dialog>
);

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: selectActiveToken(state),
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      token: selectActiveToken(state),
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
