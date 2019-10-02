import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../../utils/withData';
import Transactions from './transactions';
import { getTransactions } from '../../../../utils/api/lsk/transactions';

export default compose(
  withData({
    transactions: {
      apiUtil: getTransactions,
      defaultData: [],
      autoload: true,
    },
  }),
  withTranslation(),
)(Transactions);
