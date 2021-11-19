/* istanbul ignore file */
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '@utils/account';
import { delegateRegistered } from '@actions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  delegateRegistered,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Summary);
