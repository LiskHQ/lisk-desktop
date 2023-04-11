/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Validators from './Validators';

const mapStateToProps = (state) => ({
  watchList: state.watchList,
});

const ComposedValidators = compose(withRouter, connect(mapStateToProps))(Validators);

export default ComposedValidators;
