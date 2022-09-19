/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRegisteredDelegates } from '@transaction/api';
import withData from 'src/utils/withData';
import Delegates from './delegates';

const mapStateToProps = (state) => ({
  watchList: state.watchList,
});

const ComposedDelegates = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    registrations: {
      apiUtil: (network) =>
        getRegisteredDelegates({ network }),
      defaultData: [],
      autoload: true,
    },
  }),
)(Delegates);

export default ComposedDelegates;
