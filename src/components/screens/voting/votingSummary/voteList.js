import React from 'react';
import styles from './voteList.css';

const VoteList = ({
  list, title, className, votes,
}) => (
  <React.Fragment>
    {list.length
      ? (
        <section>
          <label>
            {`${title} (${list.length})`}
          </label>
          <label>
            <div className={`${styles.votesContainer} ${className}`}>
              {list.map(vote => (
                <span key={vote} className={`${styles.voteTag} vote`}>
                  { votes[vote] && votes[vote].rank
                    ? (
                      <span className={styles.rank}>
                        {`#${votes[vote].rank}`}
                      </span>
                    )
                    : null
                  }
                  <span className={styles.username}>{vote}</span>
                </span>
              ))}
            </div>
          </label>
        </section>
      )
      : null }
  </React.Fragment>
);

VoteList.defaultProps = {
  list: [],
  title: '',
  className: '',
  votes: {},
};

export default VoteList;
