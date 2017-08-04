import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';
import { vote } from '../../utils/api/delegate';
import { alertDialogDisplayed } from '../../actions/dialog';
import { clearVoteLists, penddingVotes } from '../../actions/voting';
// import Alert from '../dialog/alert';

class ConfirmVotes extends React.Component {
  confrim() {
    const text = 'Your votes were successfully  submitted. It can take several seconds before they are processed.';
    vote(
      this.props.activePeer,
      this.props.account.passphrase,
      this.props.account.publicKey,
      this.props.votedList,
      this.props.unvotedList,
    ).then(() => this.props.clearVoteLists());
    // this.props.closeDialog();
    this.props.penddingVotes();
    this.props.showSuccessAlert({ text });
  }
  render() {
    return (
      <article>
        <h3>Add vote to</h3>
        <ul>
          {this.props.votedList.map(item => <li key={item.username}>{item.username}</li>)}
        </ul>
        <h3>Remove vote from</h3>
        <ul>
          {this.props.unvotedList.map(item => <li key={item.username}>{item.username}</li>)}
        </ul>
        <footer className={`${grid.row} ${grid['between-xs']}`}>
            <Button key={0} label='Cancel'
              className='cancel-button'
              onClick={this.props.closeDialog}
            />
            <Button key={1} label='Confirm'
              className='send-button'
              primary={true} raised={true}
              disabled={this.props.votedList.length === 0 && this.props.unvotedList.length === 0}
              onClick={this.confrim.bind(this)}
            />
          </footer>
      </article>
    );
  }
}


const mapStateToProps = state => ({
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  showSuccessAlert: data => dispatch(alertDialogDisplayed(data)),
  clearVoteLists: () => dispatch(clearVoteLists()),
  penddingVotes: () => dispatch(penddingVotes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
