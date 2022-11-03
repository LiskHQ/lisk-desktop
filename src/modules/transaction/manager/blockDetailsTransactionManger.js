/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import BlockDetailsTransactions from '../components/BlockDetailsTransactions/BlockDetailsTransactions';

export default compose(
  withTranslation(),
)(BlockDetailsTransactions);
