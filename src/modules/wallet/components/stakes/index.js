// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getStakes } from '@pos/validator/api';
import withData from 'src/utils/withData';
import Stakes from './stakes';

const apis = {
  stakes: {
    apiUtil: (network, params) => getStakes({ network, params }),
    defaultData: [],
    autoload: false,
    transformResponse: (response) => response.data?.stakes ?? [],
  },
};

const mapStateToProps = (state) => ({
  sentStakes: state.staking,
  isValidator: state.wallet?.info?.LSK?.summary.isValidator,
});

export default compose(connect(mapStateToProps), withData(apis), withTranslation())(Stakes);
