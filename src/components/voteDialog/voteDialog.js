import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import Autocomplete from './voteAutocomplete';
import styles from './voteDialog.css';
import SecondPassphraseInput from '../secondPassphraseInput';

export default class VoteDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      secondSecret: '',
      secondPassphrase: {
        value: null,
      },
    };
  }

  confirm() {
    const secondSecret = this.props.account.secondSignature === 1 ?
      this.state.secondPassphrase.value :
      null;

    // fire first action
    this.props.votePlaced({
      activePeer: this.props.activePeer,
      account: this.props.account,
      votedList: this.props.votedList,
      unvotedList: this.props.unvotedList,
      secondSecret,
    });
  }
  setSecondPass(name, value, error) {
    this.setState({
      [name]: {
        value,
        error,
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
        <SecondPassphraseInput
          error={this.state.secondPassphrase.error}
          value={this.state.secondPassphrase.value}
          onChange={this.setSecondPass.bind(this, 'secondPassphrase')} />
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
              (this.props.votedList.length === 0 &&
              this.props.unvotedList.length === 0) ||
              (!!this.state.secondPassphrase.error ||
              this.state.secondPassphrase.value === '')
            ),
            onClick: this.confirm.bind(this),
          }} />
      </article>
    );
  }
}
