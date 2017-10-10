import Chip from 'react-toolbox/lib/chip';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import React from 'react';

import { getDelegate, listAccountDelegates } from '../../utils/api/delegate';
import styles from './voteUrlProcessor.css';

export default class VoteUrlProcessor extends React.Component {
  constructor() {
    super();
    this.state = {
      upvotes: [],
      downvotes: [],
      notFound: [],
      alreadyVoted: [],
      notVotedYet: [],
    };
    this.voteCount = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  parseParams(search) {
    return search.replace(/^\?/, '').split('&').reduce((acc, param) => {
      const keyValue = param.split('=');
      if (keyValue[0] !== '' && keyValue[1] !== 'undefined') {
        acc[keyValue[0]] = keyValue[1];
      }
      return acc;
    }, {});
  }

  componentDidMount() {
    const params = this.parseParams(this.props.history.location.search);
    if (params.upvote || params.downvote) {
      listAccountDelegates(this.props.activePeer, this.props.account.address)
        .then(({ delegates }) => {
          this.props.votesAdded({ list: delegates });
          if (params.downvote) {
            const downvotes = params.downvote.split(',');
            downvotes.forEach(this.processDownvote.bind(this));
            this.voteCount += downvotes.length;
          }
          if (params.upvote) {
            const upvotes = params.upvote.split(',');
            upvotes.forEach(this.processUpvote.bind(this));
            this.voteCount += upvotes.length;
          }
        });
    }
  }

  processUpvote(username) {
    getDelegate(this.props.activePeer, { username }).then((data) => {
      const vote = this.props.votes[username];
      if (!vote || (!vote.confirmed && !vote.unconfirmed)) {
        this.props.voteToggled({ username, publicKey: data.delegate.publicKey });
        this.pushLookupResult('upvotes', username);
      } else {
        this.pushLookupResult('alreadyVoted', username);
      }
    }).catch(() => {
      this.pushLookupResult('notFound', username);
    });
  }

  processDownvote(username) {
    getDelegate(this.props.activePeer, { username }).then((data) => {
      const vote = this.props.votes[username];
      if (vote && vote.confirmed && vote.unconfirmed) {
        this.props.voteToggled({ username, publicKey: data.delegate.publicKey });
        this.pushLookupResult('downvotes', username);
      } else {
        this.pushLookupResult('notVotedYet', username);
      }
    }).catch(() => {
      this.pushLookupResult('notFound', username);
    });
  }

  pushLookupResult(list, username) {
    this.setState({
      [list]: [...this.state[list], username],
    });
  }

  getProccessedCount() {
    return this.state.upvotes.length +
           this.state.downvotes.length +
           this.state.notFound.length +
           this.state.notVotedYet.length +
           this.state.alreadyVoted.length;
  }

  render() {
    const errorStates = {
      notFound: this.props.t('{{count}} delegate names could not be resolved:',
        { count: this.state.notFound.length }),
      alreadyVoted: this.props.t('{{count}} delegate names selected for upvote were already voted for:',
        { count: this.state.alreadyVoted.length }),
      notVotedYet: this.props.t('{{count}} delegate names selected for downvote were not voted for:',
        { count: this.state.notVotedYet.length }),
    };
    const successStates = {
      upvotes: this.props.t('{{count}} delegate names successfully resolved to add vote to.',
        { count: this.state.upvotes.length }),
      downvotes: this.props.t('{{count}} delegate names successfully resolved to remove vote from.',
        { count: this.state.downvotes.length }),
    };
    return (
      <div>
        {this.getProccessedCount() < this.voteCount ?
          (<div>
            <ProgressBar type='linear' mode='determinate'
              value={this.getProccessedCount()} max={this.voteCount}/>
            <div className={styles.center}>
              {this.props.t('Processing delegate names: ')}
              {this.getProccessedCount()} / {this.voteCount}
            </div>
          </div>) :
          (<span>{Object.keys(errorStates).map(list => (
            this.state[list].length ? (
              <div key={list} className={styles.error}>
                {errorStates[list]}
                {this.state[list].map((username, i) => (
                  <Chip theme={styles} key={i}>{username}</Chip>
                ))}
              </div>
            ) : null
          ))}
          {Object.keys(successStates).map(list => (
            this.state[list].length ? (
              <div key={list} className={styles.success}>{successStates[list]}</div>
            ) : null
          ))}</span>)}
      </div>
    );
  }
}
