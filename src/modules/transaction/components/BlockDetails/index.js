/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '@common/utilities/withData';
import { tokenMap } from '@token/configuration/tokens';
import Transactions from './Transactions';
import { getTransactions } from '../../utils/api';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, params) => getTransactions({ network, params }, tokenMap.LSK.key),
      defaultData: [],
      getApiParams: (_, ownProps) => {
        if (ownProps.blockId) return { blockId: ownProps.blockId };
        return { height: ownProps.height };
      },
      transformResponse: response => response.data,
    },
  }),
  withTranslation(),
)(Transactions);
