import Chip from 'react-toolbox/lib/chip';
import React from 'react';

import { getDelegate } from '../../utils/api/delegate';
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
    if (params.upvote) {
      params.upvote.split(',').forEach(this.processUpvote.bind(this));
    }
    if (params.downvote) {
      params.downvote.split(',').forEach(this.processDownvote.bind(this));
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
      if (vote && vote.confirmed && !vote.unconfirmed) {
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
        { count: this.state.upvotes.length }),
    };
    return (
      <div>
        {Object.keys(errorStates).map(list => (
          this.state[list].length ? (
            <div key={list} className={styles.error}>
              {errorStates[list]}
              {this.state[list].map(username => (
                <Chip theme={styles} key={username}>{username}</Chip>
              ))}
            </div>
          ) : null
        ))}
        {Object.keys(successStates).map(list => (
          this.state[list].length ? (
            <div key={list} className={styles.success}>{successStates[list]}</div>
          ) : null
        ))}
      </div>
    );
  }
}
