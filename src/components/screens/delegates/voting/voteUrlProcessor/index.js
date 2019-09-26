/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { getAPIClient } from '../../../../../utils/api/network';
import { tokenMap } from '../../../../../constants/tokens';
import {
  loadDelegates,
  loadVotes,
  voteToggled,
} from '../../../../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapDispatchToProps = {
  voteToggled,
  loadVotes,
  loadDelegates,
};

const mapStateToProps = state => ({
  delegates: state.voting.delegates,
  liskAPIClient: getAPIClient(state.settings.token.active || tokenMap.LSK.key, state),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(VoteUrlProcessor)));
