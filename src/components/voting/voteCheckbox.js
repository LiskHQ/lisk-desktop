import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import { connect } from 'react-redux';
import { addedToVoteList, removedFromVoteList } from '../../actions/voting';
import Spinner from '../spinner';

export class VoteCheckbox extends React.Component {
  /**
   * change status of selected row
   * @param {Number} index - index of row that we want to change status of that
   * @param {Boolean} value - value of checkbox
   */
  toggle(delegate, value) {
    if (value) {
      this.props.addToVoteList(delegate);
    } else {
      this.props.removeFromVoteList(delegate);
    }
  }

  render() {
    const template = this.props.pending ?
      <Spinner /> :
      <Checkbox
        className={this.props.styles.field}
        checked={this.props.value}
        onChange={this.toggle.bind(this, this.props.data)}
      />;
    return template;
  }
}

const mapDispatchToProps = dispatch => ({
  addToVoteList: data => dispatch(addedToVoteList(data)),
  removeFromVoteList: data => dispatch(removedFromVoteList(data)),
});

export default connect(null, mapDispatchToProps)(VoteCheckbox);

