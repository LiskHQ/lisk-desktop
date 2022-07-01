// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigGroupRegistered } from '@wallet/store/action';
import { selectActiveTokenAccount } from '@common/store';

import Summary from './Summary';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  multisigGroupRegistered,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Summary);
