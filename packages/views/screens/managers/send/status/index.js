/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getAccount } from '@wallet/utils/api';
import { getActiveTokenAccount } from '@wallet/utils/account';
import withData from '@common/utilities/withData';
import Status from './status';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  transactions: state.transactions,
  token: state.token.active,
});

const apis = {
  recipientAccount: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    getApiParams: state => ({
      token: state.token.active,
    }),
    defaultData: {},
  },
};

export default compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Status);
