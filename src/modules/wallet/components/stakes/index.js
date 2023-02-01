// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getStakes } from '@pos/validator/api';
import { getAccounts } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import Stakes from './stakes';

const apis = {
  stakes: {
    apiUtil: (network, params) => getStakes({ network, params }),
    defaultData: [],
    autoload: false,
    transformResponse: (response) => response.data?.stakes ?? [],
  },
  accounts: {
    apiUtil: (network, params) => getAccounts({ network, params }),
    autoload: false,
    defaultData: {},
    transformResponse: (response) =>
      response.data.reduce((dict, account) => {
        dict[account.summary.address] = account;
        return dict;
      }, {}),
  },
};

const mapStateToProps = (state) => ({
  sentStakes: state.staking,
  isValidator: state.wallet?.info?.LSK?.summary.isValidator,
});

export default compose(connect(mapStateToProps), withData(apis), withTranslation())(Stakes);
