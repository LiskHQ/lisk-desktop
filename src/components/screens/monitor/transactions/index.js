/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../../utils/withData';
import Transactions from './transactions';
import liskServiceApi from '../../../../utils/api/lsk/liskService';

export default compose(
  withData({
    transactions: {
      apiUtil: liskServiceApi.getTransactions,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.filter(block => !oldData.find(({ id }) => id === block.id))]
          : response
      ),
    },
  }),
  withTranslation(),
)(Transactions);
