import Chip from 'react-toolbox/lib/chip';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import React from 'react';

import { parseSearchParams } from '../../utils/searchParams';
import styles from './voteUrlProcessor.css';

export default class VoteUrlProcessor extends React.Component {
  componentDidMount() {
    this.props.clearVoteLookupStatus();
    const params = parseSearchParams(this.props.history.location.search);
    if (params.votes || params.unvotes) {
      const upvotes = params.votes ? params.votes.split(',') : [];
      const unvotes = params.unvotes ? params.unvotes.split(',') : [];
      this.props.urlVotesFound({
        activePeer: this.props.activePeer,
        upvotes,
        unvotes,
        address: this.props.account.address,
      });
    }
  }

  getProcessedCount() {
    return this.props.urlVoteCount - this.props.pending.length;
  }

  render() {
    const errorMessages = {
      notFound: this.props.t('{{count}} of the provided delegate names could not be resolved:',
        { count: this.props.notFound.length }),
      alreadyVoted: this.props.t('{{count}} of the delegate names selected for voting was already voted for for:',
        { count: this.props.alreadyVoted.length }),
      notVotedYet: this.props.t('{{count}} of the delegate names selected for unvoting was not currently voted for:',
        { count: this.props.notVotedYet.length }),
    };
    const successMessages = {
      upvotes: this.props.t('{{count}} delegate names were successfully resolved for voting.',
        { count: this.props.upvotes.length }),
      unvotes: this.props.t('{{count}} delegate names were successfully resolved for unvoting.',
        { count: this.props.unvotes.length }),
    };
    return (
      <div>
        {this.getProcessedCount() < this.props.urlVoteCount ?
          (<div>
            <ProgressBar type='linear' mode='determinate'
              value={this.getProcessedCount()} max={this.props.urlVoteCount}/>
            <div className={styles.center}>
              {this.props.t('Processing delegate names: ')}
              {this.getProcessedCount()} / {this.props.urlVoteCount}
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
