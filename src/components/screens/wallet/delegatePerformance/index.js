/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '@utils/account';
import { getDelegate } from '@api/delegate';
import withData from '@utils/withData';
import { parseSearchParams } from '@utils/searchParams';
import { withTranslation } from 'react-i18next';
import DelegatePerformance from './delegatePerformance';

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: state.settings.token?.active ?? 'LSK',
});

const apis = {
  delegate: {
    apiUtil: (network, { address }) =>
      getDelegate({ network, params: { address } }),
    getApiParams: (state, ownProps) => ({
      address: parseSearchParams(ownProps.location.search).address,
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
)(DelegatePerformance);
