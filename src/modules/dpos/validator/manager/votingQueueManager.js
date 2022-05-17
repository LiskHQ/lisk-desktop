/* istanbul ignore file */
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { processLaunchProtocol } from '@common/store/actions';
import VotingQueue from '../components/votingQueue';

const mapDispatchToProps = {
  processLaunchProtocol,
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
  withTranslation(),
)(VotingQueue);
