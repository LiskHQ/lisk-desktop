import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from '@common/store';
import Request from './request';

export default connect(
  state => ({
    address: selectActiveTokenAccount(state).summary?.address ?? '',
  }),
  {},
)(withTranslation()(Request));
