import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { vote } from '../../utils/api/delegate';
import { alertDialogDisplayed } from '../../actions/dialog';
import { clearVoteLists, pendingVotes } from '../../actions/voting';
import InfoParagraph from '../infoParagraph';

const delay = 10000;
class ConfirmVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      secondSecret: '',
    };
  }
  confrim() {
    const secondSecret = this.state.secondSecret.length === 0 ? null : this.state.secondSecret;
    const text = 'Your votes were successfully  submitted. It can take several seconds before they are processed.';
    vote(
      this.props.activePeer,
      this.props.account.passphrase,
      this.props.account.publicKey,
      this.props.votedList,
      this.props.unvotedList,
      secondSecret,
    ).then(() => {
      this.props.pendingVotes();
      setTimeout(() => {
        this.props.clearVoteLists();
      }, delay);
      this.props.showSuccessAlert({
        title: 'Success',
        type: 'success',
        text,
      });
    }); // this.props.clearVoteLists());
    // this.props.closeDialog();
  }
  setSecondPass(name, value) {
    this.setState({ ...this.state, [name]: value });
  }
  render() {
    const secondPass = this.props.account.secondSignature === 0 ? null :
      <Input type='text' label='Second Passphrase' name='secondSecret'
        value={this.state.secondSecret} onChange={this.setSecondPass.bind(this, 'secondSecret')}/>;
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
        {secondPass}
        <InfoParagraph>
          <p>You can select up to 33 delegates in one voting turn.</p>
          <p>You can vote for up to 101 delegates in total.</p>
        </InfoParagraph>
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
  pendingVotes: () => dispatch(pendingVotes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
