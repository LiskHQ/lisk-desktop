/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getAccount } from '@wallet/api';
import { getActiveTokenAccount } from '@common/utilities/account';
import withData from '@common/utilities/withData';
import Status from './status';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  transactions: state.transactions,
  token: state.settings.token.active,
});

const apis = {
  recipientAccount: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    getApiParams: state => ({
      token: state.settings.token.active,
    }),
    defaultData: {},
  },
};

export default compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Status);
