import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import Autocomplete from './voteAutocomplete';
import styles from './voteDialog.css';
import AuthInputs from '../authInputs';
import { authStatePrefill, authStateIsValid } from '../../utils/form';

export default class VoteDialog extends React.Component {
  constructor() {
    super();
    this.state = authStatePrefill();
  }

  componentDidMount() {
    this.setState(authStatePrefill(this.props.account));
  }

  confirm() {
    this.props.votePlaced({
      activePeer: this.props.activePeer,
      account: this.props.account,
      votes: this.props.votes,
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
    const { votes } = this.props;
    let totalVotes = 0;
    const votesList = [];
    Object.keys(votes).forEach((item) => {
      if (votes[item].confirmed || votes[item].unconfirmed) totalVotes++;
      if (votes[item].confirmed !== votes[item].unconfirmed) votesList.push(item);
    });
    return (
      <article>
        <Autocomplete
          votedDelegates={this.props.delegates}
          votes={this.props.votes}
          voteToggled={this.props.voteToggled}
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
            label: this.props.t('Confirm'),
            fee: Fees.vote,
            disabled: (
              totalVotes > 101 ||
              votesList.length === 0 ||
              votesList.length > 33 ||
              !authStateIsValid(this.state)
            ),
            onClick: this.confirm.bind(this),
          }} />
      </article>
    );
  }
}
