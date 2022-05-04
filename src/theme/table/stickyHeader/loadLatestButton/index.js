import { connect } from 'react-redux';
import LoadLatestButton from './loadLatestButton';

const mapStateToProps = state => ({
  latestBlocks: state.blocks.latestBlocks,
});

export default connect(mapStateToProps)(LoadLatestButton);
