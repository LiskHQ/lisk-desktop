import Chip from 'react-toolbox/lib/chip';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import React from 'react';

import { parseSearchParams } from '../../utils/searchParams';
import styles from './voteUrlProcessor.css';

export default class VoteUrlProcessor extends React.Component {
  componentDidMount() {
    this.props.clearVoteLookupStatus();
    const params = parseSearchParams(this.props.history.location.search);
    if (params.upvote || params.downvote) {
      const upvotes = params.upvote ? params.upvote.split(',') : [];
      const downvotes = params.downvote ? params.downvote.split(',') : [];
      this.props.urlVotesFound({
        activePeer: this.props.activePeer,
        upvotes,
        downvotes,
        address: this.props.account.address,
      });
    }
  }

  getProccessedCount() {
    return this.props.urlVoteCount - this.props.pending.length;
  }

  render() {
    const errorMessages = {
      notFound: this.props.t('{{count}} of entered delegate names could not be resolved:',
        { count: this.props.notFound.length }),
      alreadyVoted: this.props.t('{{count}} of delegate names selected for upvote were already voted for:',
        { count: this.props.alreadyVoted.length }),
      notVotedYet: this.props.t('{{count}} of delegate names selected for downvote were not voted for:',
        { count: this.props.notVotedYet.length }),
    };
    const successMessages = {
      upvotes: this.props.t('{{count}} delegate names successfully resolved to add vote to.',
        { count: this.props.upvotes.length }),
      downvotes: this.props.t('{{count}} delegate names successfully resolved to remove vote from.',
        { count: this.props.downvotes.length }),
    };
    return (
      <div>
        {this.getProccessedCount() < this.props.urlVoteCount ?
          (<div>
            <ProgressBar type='linear' mode='determinate'
              value={this.getProccessedCount()} max={this.props.urlVoteCount}/>
            <div className={styles.center}>
              {this.props.t('Processing delegate names: ')}
              {this.getProccessedCount()} / {this.props.urlVoteCount}
            </div>
          </div>) :
          (<span>{Object.keys(errorMessages).map(list => (
            this.props[list].length ? (
              <div key={list} className={`${styles.error} ${list}-message`}>
                {errorMessages[list]}
                {this.props[list].map((username, i) => (
                  <Chip theme={styles} key={i}>{username}</Chip>
                ))}
              </div>
            ) : null
          ))}
          {Object.keys(successMessages).map(list => (
            this.props[list].length ? (
              <div key={list} className={`${styles.success} ${list}-message`}>{successMessages[list]}</div>
            ) : null
          ))}</span>)}
      </div>
    );
  }
}
