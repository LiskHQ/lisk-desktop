import React from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import { vote } from '../../utils/api/delegate';
import { alertDialogDisplayed } from '../../actions/dialog';
import { clearVoteLists, pendingVotesAdded } from '../../actions/voting';
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
    const text = 'Your votes were successfully  submitted. It can take several seconds before they are processed.';

    vote(
      this.props.activePeer,
      this.props.account.passphrase,
      this.props.account.publicKey,
      this.props.votedList,
      this.props.unvotedList,
      secondSecret,
    ).then((data) => {
      this.props.pendingVotesAdded();

      // add to pending transaction
      this.props.addTransaction({
        id: data.transactionId,
        senderPublicKey: this.props.account.publicKey,
        senderId: this.props.account.address,
        amount: 0,
        fee: Fees.vote,
        type: 3,
      });

      // remove pending votes
      setTimeout(() => {
        this.props.clearVoteLists();
      }, SYNC_ACTIVE_INTERVAL);
      this.props.showSuccessAlert({
        title: 'Success',
        type: 'success',
        text,
      });
    });
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
            label: 'Vote',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
