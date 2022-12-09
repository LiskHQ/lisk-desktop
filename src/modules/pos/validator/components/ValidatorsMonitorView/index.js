/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRegisteredDelegates } from '@transaction/api';
import withData from 'src/utils/withData';
import Validators from './Validators';

const mapStateToProps = (state) => ({
  watchList: state.watchList,
});

const ComposedValidators = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    registrations: {
      apiUtil: (network) => getRegisteredDelegates({ network }),
      defaultData: [],
      autoload: true,
    },
  })
)(Validators);

export default ComposedValidators;
