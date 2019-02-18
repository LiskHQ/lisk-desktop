/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { testExtensions } from '../../actions/transactions.js';
import ExtensionPoint from './extensionPoint';

const mapStateToProps = state => ({
  modules: (state.extensions && state.extensions.modules) || {},
  test: state.transactions.test,
  blocks: state.blocks,
});

const mapDispatchToProps = {
  testExtensions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ExtensionPoint));

