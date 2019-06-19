/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { delegatesFetched } from '../../../actions/delegate';
import SelectName from './selectName';

const mapStateToProps = state => ({
  account: state.account,
  delegate: state.delegate,
});

const mapDispatchToProps = {
  delegatesFetched,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SelectName));
