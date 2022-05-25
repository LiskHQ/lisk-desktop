import { compose } from 'redux';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import withFilters from 'src/utils/withFilters';

const mapStateToProps = (state) => ({
  blocks: state.blocks,
});

const activeDelegatesManager = compose(
  // withRouter,
  connect(mapStateToProps),
  // withData({
);

export default activeDelegatesManager;