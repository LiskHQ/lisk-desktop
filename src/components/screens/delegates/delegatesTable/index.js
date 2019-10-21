/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../../utils/account';
import { loadVotes, voteToggled } from '../../../../actions/voting';
import DelegatesTable from './delegatesTable';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  votes: state.voting.votes,
  delegates: state.voting.delegates,
});

const mapDispatchToProps = {
  voteToggled,
  loadVotes,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(DelegatesTable);
