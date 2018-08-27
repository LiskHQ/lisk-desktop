import React from 'react';
import { translate } from 'react-i18next';
import { getVoteClass } from '../../utils/voting';
import styles from './voteMatrix.css';

class VotesMatrix extends React.Component {
  render() {
    return (
      <section>
        <div className={styles.header}>
            <div className={styles.headerItem}>
              {this.props.t('Total')}
              <div className={styles.ratio}>
                {this.props.totalVotesCount}
                <span>/</span>
                <span>{this.props.maxCountOfVotes}</span>
              </div>
            </div>
            <div className={styles.headerItem}>
              {this.props.t('Selection')}
              <div className={styles.ratio}>
                {this.props.totalNewVotesCount}
                <span>/</span>
                <span>{this.props.maxCountOfVotesInOneTurn}</span>
              </div>
            </div>
        </div>
        <ul className={styles.list}>
          {
            this.props.delegates.map((delegate, idx) => {
              const voteObj = this.props.votes[delegate.username];
              const voteClass = getVoteClass(voteObj, styles);
              return (
                <li className={`${styles.listItem} ${voteClass}`} key={idx}>
                  <p className={`${styles.tooltip}`}>
                    <span data-delegate>{delegate.username}</span>
                    <span data-unvote> {this.props.t('(unvote)')}</span>
                    <span data-vote> {this.props.t('(vote)')}</span>
                    <span data-voted> {this.props.t('(voted)')}</span>
                    <span data-free>{this.props.t('Free slot')}</span>
                  </p>
                </li>
              );
            })
          }
        </ul>
      </section>
    );
  }
}
export default translate()(VotesMatrix);
