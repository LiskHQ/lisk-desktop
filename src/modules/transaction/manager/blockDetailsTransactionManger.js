/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import BlockDetailsTransactions from '../components/BlockDetailsTransactions/BlockDetailsTransactions';
import { getTransactions } from '../api';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, params) => getTransactions({ network, params }),
      defaultData: [],
      getApiParams: (_, ownProps) => {
        if (ownProps.blockId) return { blockId: ownProps.blockId };
        return { height: ownProps.height };
      },
      transformResponse: response => response.data,
    },
  }),
  withTranslation(),
)(BlockDetailsTransactions);
