import React from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import Chip from 'react-toolbox/lib/chip';
import { Card } from 'react-toolbox/lib/card';
import { List, ListItem } from 'react-toolbox/lib/list';
import { vote, voteAutocomplete } from '../../utils/api/delegate';
import { alertDialogDisplayed } from '../../actions/dialog';
import { clearVoteLists, pendingVotesAdded, addedToVoteList, removedFromVoteList } from '../../actions/voting';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import { SYNC_ACTIVE_INTERVAL } from '../../constants/api';
import Fees from '../../constants/fees';
import styles from './voting.css';

export class ConfirmVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      secondSecret: '',
      suggestionClass: styles.hidden,
      votedResult: [],
      votedListSearch: '',
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
  suggestionStatus(value) {
    const className = value ? '' : styles.hidden;
    setTimeout(() => {
      this.setState({ suggestionClass: className });
    }, 200);
  }
  search(name, value) {
    this.setState({ ...this.state, [name]: value });
    if (value.length > 0) {
      voteAutocomplete(this.props.activePeer, value, this.props.voted)
        .then((res) => {
          this.setState({
            votedResult: res,
            suggestionClass: '',
          });
        });
    } else {
      this.setState({
        votedResult: [],
        suggestionClass: styles.hidden,
      });
    }
  }
  keyPress(event) {
    const selected = this.state.votedResult.filter(d => d.hovered);
    switch (event.keyCode) {
      case 40:
        this.handleArrowDown(this.state.votedResult, 'votedResult');
        return false;
      case 38:
        this.handleArrowUp(this.state.votedResult, 'votedResult');
        return false;
      case 27 :
        this.setState({
          suggestionClass: styles.hidden,
        });
        return false;
      case 13 :
        if (selected.length > 0) {
          this.addToVoted(selected[0]);
        }
        return false;
      default:
        break;
    }
    return true;
  }

  handleArrowDown(list, name) {
    const selected = list.filter(d => d.hovered);
    const index = list.indexOf(selected[0]);
    if (selected.length > 0 && list[index + 1]) {
      list[index].hovered = false;
      list[index + 1].hovered = true;
    } else if (list[index + 1]) {
      list[0].hovered = true;
    }
    this.setState({ [name]: list });
  }

  handleArrowUp(list, name) {
    const selected = list.filter(d => d.hovered);
    const index = list.indexOf(selected[0]);
    if (index - 1 > -1) {
      list[index].hovered = false;
      list[index - 1].hovered = true;
    }
    this.setState({ [name]: list });
  }
  addToVoted(item) {
    this.props.addedToVoteList(item);
    this.setState({
      votedListSearch: '',
      suggestionClass: styles.hidden,
    });
  }

  render() {
    const secondPassphrase = this.props.account.secondSignature === 1 ?
      <Input type='text' label='Second Passphrase' name='secondSecret'
        className='secondSecret second-passphrase' value={this.state.secondSecret}
        onChange={this.setSecondPass.bind(this, 'secondSecret')}/> : null;

    return (
      <article>
        <h3>Add vote to</h3>
        <div>
          {this.props.votedList.map(
            item => <Chip key={item.username}
              deletable
              onDeleteClick={this.props.removedFromVoteList.bind(this, item)}>
                {item.username}
              </Chip>,
          )}
        </div>
        <section className={styles.searchContainer}>
          <Input type='text' label='search' name='votedListSearch'
            className='votedListSearch' value={this.state.votedListSearch}
            // onFocus={this.suggestionStatus.bind(this, true)}
            onBlur={this.suggestionStatus.bind(this, false)}
            onKeyDown={this.keyPress.bind(this)}
            onChange={this.search.bind(this, 'votedListSearch')}/>
          <Card className={`${styles.searchResult} ${this.state.suggestionClass}`}>
            <List selectable>
              {this.state.votedResult.map(
                item => <ListItem
                  key={item.username}
                  caption={item.username}
                  selectable={true}
                  selected={true}
                  className={item.hovered ? styles.selectedRow : ''}
                  onClick={this.addToVoted.bind(this, item)} />,
              )}
            </List>
          </Card>
        </section>
        <h3>Remove vote from</h3>
        <div>
          {this.props.unvotedList.map(
            item => <Chip key={item.username}
              deletable
              onDeleteClick={this.props.addedToVoteList.bind(this, item)}>
                {item.username}
              </Chip>,
          )}
        </div>

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
  addedToVoteList: data => dispatch(addedToVoteList(data)),
  removedFromVoteList: data => dispatch(removedFromVoteList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
