import React from 'react';
import { authStatePrefill, authStateIsValid } from '../../utils/form';
import ActionBar from '../actionBar';
import AuthInputs from '../authInputs';
import Autocomplete from './voteAutocomplete';
import Fees from '../../constants/fees';
import InfoParagraph from '../infoParagraph';
import styles from './voteDialog.css';
import votingConst from '../../constants/voting';
import { getTotalVotesCount, getNewVotesCount } from '../../utils/voting';

const { maxCountOfVotes, maxCountOfVotesInOneTurn } = votingConst;

export default class VoteDialog extends React.Component {
  constructor() {
    super();
    this.state = authStatePrefill();
  }

  componentDidMount() {
    this.setState(authStatePrefill(this.props.account));
  }

  confirm(event) {
    event.preventDefault();
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
    const countOfVotesInOneTurn = getNewVotesCount(votes);
    return (
      <article>
        <form id='voteform'>
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
                {this.props.t('You can select up to {{count}} delegates in one voting turn.', { count: maxCountOfVotesInOneTurn })}
              </p>
              <p >
                {this.props.t('You can vote for up to {{count}} delegates in total.', { count: maxCountOfVotes })}
              </p>
            </InfoParagraph>
          </article>

          <ActionBar
            secondaryButton={{
              onClick: this.props.closeDialog,
            }}
            primaryButton={{
              label: this.props.t('Confirm'),
              onClick: this.confirm.bind(this),
              fee: Fees.vote,
              type: 'button',
              disabled: (
                getTotalVotesCount(votes) > maxCountOfVotes ||
                countOfVotesInOneTurn === 0 ||
                countOfVotesInOneTurn > maxCountOfVotesInOneTurn ||
                !authStateIsValid(this.state)
              ),
            }} />
        </form>
      </article>
    );
  }
}
