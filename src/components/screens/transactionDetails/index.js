/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { getActiveTokenAccount } from '../../../utils/account';
import liskService from '../../../utils/api/lsk/liskService';
import { getSingleTransaction } from '../../../utils/api/transactions';
import withData from '../../../utils/withData';
import { parseSearchParams } from '../../../utils/searchParams';

import TransactionDetails from './transactionDetails';

const mapStateToProps = (state, ownProps) => ({
  address: getActiveTokenAccount(state).address,
  id: ownProps.match.params.id,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
  netCode: state.network.networks.LSK.code,
});

const apis = {
  transaction: {
    apiUtil: (network, params) => getSingleTransaction({ network, ...params }),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      id: parseSearchParams(ownProps.location.search).transactionId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
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
  withTranslation(),
)(TransactionDetails);
