// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Stakes from './stakes';

const mapStateToProps = (state) => ({
  sentStakes: state.staking,
  isValidator: state.wallet?.info?.LSK?.summary.isValidator,
});

export default compose(connect(mapStateToProps), withTranslation())(Stakes);
