/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '@common/utilities/account';
import { getTransaction } from '@common/utilities/api/transaction';
import withData from '@common/utilities/withData';
import { parseSearchParams } from '@common/utilities/searchParams';
import { withTranslation } from 'react-i18next';
import TransactionDetails from './transactionDetails';

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: state.settings.token?.active ?? 'LSK',
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
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
)(TransactionDetails);
