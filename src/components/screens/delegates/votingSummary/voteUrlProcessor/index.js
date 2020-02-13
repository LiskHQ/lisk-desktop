/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getAPIClient } from '../../../../../utils/api/network';
import { tokenMap } from '../../../../../constants/tokens';
import {
  delegatesLoaded,
  loadVotes,
  voteToggled,
} from '../../../../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapDispatchToProps = {
  voteToggled,
  loadVotes,
  delegatesLoaded,
};

const mapStateToProps = state => ({
  delegates: state.voting.delegates,
  liskAPIClient: getAPIClient(state.settings.token.active || tokenMap.LSK.key, state.network),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(VoteUrlProcessor)));
