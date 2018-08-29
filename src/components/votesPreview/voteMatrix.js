import React from 'react';
import { translate } from 'react-i18next';
import { getVoteClass } from '../../utils/voting';
import styles from './voteMatrix.css';

class VotesMatrix extends React.Component {
  render() {
    const { votes, delegates } = this.props;
    const votesArray = delegates
      .filter(delegate => Object.keys(votes).indexOf(delegate.username) > -1)
      .reduce((total, delegate) => {
        total.push({
          username: delegate.username,
          ...votes[delegate.username],
          rank: delegate.rank,
        });
        return total;
      }, []);

    const upVotedDelegates = votesArray.filter(vote =>
      vote.confirmed !== vote.unconfirmed && !vote.confirmed);
    // const downVotedDelegates = votesArray.filter(vote =>
    //   vote.confirmed !== vote.unconfirmed && vote.confirmed);
    const votedDelegates = votesArray.filter(vote =>
      vote.confirmed === vote.unconfirmed && vote.confirmed);

    const freeSlotLength =
      this.props.maxCountOfVotes -
      this.props.totalVotesCount;

    const freeSlots = freeSlotLength > 0 ? new Array(freeSlotLength).fill({ username: '' }) : [];

    const generateSeats = array => array.map((vote, idx) => (
      <li className={`${styles.listItem} ${getVoteClass(vote, styles)}`} key={idx}>
          <p className={`${styles.tooltip}`}>
            <span data-delegate>{vote.username}</span>
            <span data-unvote> {this.props.t('(unvote)')}</span>
            <span data-vote> {this.props.t('(vote)')}</span>
            <span data-voted> {this.props.t('(voted)')}</span>
            <span data-free>{this.props.t('Free slot')}</span>
          </p>
      </li>
    ));

    return (
      <section>
        <div className={styles.header}>
            <div className={styles.headerItem}>
              {this.props.t('Total')}
              <div className={`${styles.ratio} total-votes`}>
                {this.props.totalVotesCount}
                <span>/</span>
                <span>{this.props.maxCountOfVotes}</span>
              </div>
            </div>
            <div className={styles.headerItem}>
              {this.props.t('Selection')}
              <div className={`${styles.ratio} current-votes`}>
                {this.props.totalNewVotesCount}
                <span>/</span>
                <span>{this.props.maxCountOfVotesInOneTurn}</span>
              </div>
            </div>
        </div>
        <ul className={styles.list}>
          {
            generateSeats(votedDelegates)
          }{
            generateSeats(upVotedDelegates)
          }{
            generateSeats(freeSlots)
          }
        </ul>
      </section>
    );
  }
}
export default translate()(VotesMatrix);
