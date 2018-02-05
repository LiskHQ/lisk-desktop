import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Voting from './voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
});


export default connect(mapStateToProps)(translate()(Voting));
