/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '../../../utils/account';
import liskService from '../../../utils/api/lsk/liskService';
import { getSingleTransaction } from '../../../utils/api/transactions';
import withData from '../../../utils/withData';
import TransactionDetails from './transactionDetails';
import { parseSearchParams } from '../../../utils/searchParams';

const mapStateToProps = (state, ownProps) => ({
  address: getActiveTokenAccount(state).address,
  id: ownProps.match.params.id,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
  netCode: state.network.networks.LSK.code,
});

const apis = {
  transaction: {
    apiUtil: liskService.getTransaction,
    getApiParams: (state, ownProps) => ({
      id: parseSearchParams(ownProps.location.search).transactionId,
    }),
    autoload: true,
  },

  delegates: {
    apiUtil: liskService.getAccounts,
    autoload: false,
    defaultData: {},
    transformResponse: response => response.reduce((acc, item) => {
      acc[item.address] = item;
      return acc;
    }, {}),
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
)(TransactionDetails);
