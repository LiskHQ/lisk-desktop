import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import Autocomplete from './voteAutocomplete';
import styles from './voteDialog.css';
import AuthInputs from '../authInputs';
import { authStatePrefill } from '../../utils/form';

export default class VoteDialog extends React.Component {
  constructor() {
    super();
    this.state = authStatePrefill();
  }

  componentDidMount() {
    const newState = {
      recipient: {
        value: this.props.recipient || '',
      },
      amount: {
        value: this.props.amount || '',
      },
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  confirm() {
    this.props.votePlaced({
      activePeer: this.props.activePeer,
      account: this.props.account,
      votedList: this.props.votedList,
      unvotedList: this.props.unvotedList,
      secondSecret: this.state.secondPassphrase.value,
      passphrase: this.state.passphrase.value,
    });
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : null,
      },
    });
  }

  render() {
    return (
      <article>
        <Autocomplete
          voted={this.props.voted}
          votedList={this.props.votedList}
          unvotedList={this.props.unvotedList}
          addedToVoteList={this.props.addedToVoteList}
          removedFromVoteList={this.props.removedFromVoteList}
          activePeer={this.props.activePeer} />
        <AuthInputs
          passphrase={this.state.passphrase}
          secondPassphrase={this.state.secondPassphrase}
          onChange={this.handleChange.bind(this)} />
        <article className={styles.info}>
          <InfoParagraph>
            <p >
              You can select up to 33 delegates in one voting turn.
            </p>
            You can vote for up to 101 delegates in total.
          </InfoParagraph>
        </article>

        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Confirm',
            fee: Fees.vote,
            disabled: (
              (this.props.voted.length +
                (this.props.votedList.length -
                this.props.unvotedList.length) > 101) ||
              (this.props.votedList.length +
                this.props.unvotedList.length > 33) ||
              (this.props.votedList.length === 0 &&
                this.props.unvotedList.length === 0) ||
              !!this.state.passphrase.error ||
              !this.state.passphrase.value ||
              (!!this.state.secondPassphrase.error ||
                this.state.secondPassphrase.value === '')
            ),
            onClick: this.confirm.bind(this),
          }} />
      </article>
    );
  }
}
