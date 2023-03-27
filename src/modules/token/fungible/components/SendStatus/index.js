/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getAccount } from '@wallet/utils/api';
import { selectActiveTokenAccount, selectActiveToken } from 'src/redux/selectors';
import withData from 'src/utils/withData';
import Status from './Status';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  transactions: state.transactions,
  token: selectActiveToken(state),
});

const apis = {
  recipientAccount: {
    apiUtil: (network, params) => getAccount({ network, params }),
    defaultData: {},
  },
};

export default compose(connect(mapStateToProps), withData(apis), withTranslation())(Status);
