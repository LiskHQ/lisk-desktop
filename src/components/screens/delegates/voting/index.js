/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { getActiveTokenAccount } from '../../../../utils/account';
import { votePlaced } from '../../../../actions/voting';
import Voting from './voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  votePlaced,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Voting)));
