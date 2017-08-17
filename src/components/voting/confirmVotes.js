import React from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import { alertDialogDisplayed } from '../../actions/dialog';
import { clearVoteLists, pendingVotesAdded, votePlaced } from '../../actions/voting';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import { SYNC_ACTIVE_INTERVAL } from '../../constants/api';
import Fees from '../../constants/fees';

export class ConfirmVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      secondSecret: '',
    };
  }

  confirm() {
    const secondSecret = this.state.secondSecret.length === 0 ? null : this.state.secondSecret;

    // fire first action
    this.props.votePlaced({
      activePeer: this.props.activePeer,
      account: this.props.account,
      votedList: this.props.votedList,
      unvotedList: this.props.unvotedList,
      secondSecret,
    });

    // fire second action
    setTimeout(() => {
      this.props.clearVoteLists();
    }, SYNC_ACTIVE_INTERVAL);
  }

  setSecondPass(name, value) {
    this.setState({ ...this.state, [name]: value });
  }

  render() {
    const secondPassphrase = this.props.account.secondSignature === 1 ?
      <Input type='text' label='Second Passphrase' name='secondSecret'
        className='secondSecret second-passphrase' value={this.state.secondSecret}
        onChange={this.setSecondPass.bind(this, 'secondSecret')}/> : null;

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

        {secondPassphrase}

        <InfoParagraph>
          You can select up to 33 delegates in one voting turn.
          <br />
          You can vote for up to 101 delegates in total.
        </InfoParagraph>

        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Confirm',
            fee: Fees.vote,
            disabled: (
              this.props.votedList.length === 0 &&
              this.props.unvotedList.length === 0),
            onClick: this.confirm.bind(this),
          }} />
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
  pendingVotesAdded: () => dispatch(pendingVotesAdded()),
  votePlaced: data => dispatch(votePlaced(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
