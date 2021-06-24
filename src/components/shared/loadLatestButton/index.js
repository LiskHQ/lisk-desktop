import { connect } from 'react-redux';

const mapStateToProps = state => ({
  latestBlocks: state.blocks.latestBlocks,
});

export default connect(mapStateToProps);
