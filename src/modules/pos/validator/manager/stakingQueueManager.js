/* istanbul ignore file */
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { processLaunchProtocol } from 'src/redux/actions';
import StakingQueue from '../components/StakingQueue';

const mapDispatchToProps = {
  processLaunchProtocol,
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
  withTranslation(),
)(StakingQueue);
