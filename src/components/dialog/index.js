import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Dialog from './dialog';

const mapStateToProps = state => ({
  dialog: state.dialog,
});

export default withRouter(connect(mapStateToProps)(Dialog));
