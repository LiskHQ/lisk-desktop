import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import { connect } from 'react-redux';
import { addToVoteList, removeFromVoteList } from '../../actions/voting';
import Snipper from '../spinner';

class selectableRow extends React.Component {
  /**
   * change status of selected row
   * @param {integer} index - index of row that we want to change status of that
   * @param {boolian} value - value of checkbox
   */
  handleChange(delegate, value) {
    if (value) {
      this.props.addToVoteList(delegate);
    } else if (!value) {
      this.props.removeFromVoteList(delegate);
    }
  }
  render() {
    const template = this.props.pending ? <Snipper /> :
      <Checkbox className={this.props.styles.field}
        checked={this.props.value}
        onChange={this.handleChange.bind(this, this.props.data)}
      />;
    return template;
  }
}

const mapDispatchToProps = dispatch => ({
  addToVoteList: data => dispatch(addToVoteList(data)),
  removeFromVoteList: data => dispatch(removeFromVoteList(data)),
});

export default connect(null, mapDispatchToProps)(selectableRow);

