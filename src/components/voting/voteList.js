import React from 'react';
import styles from './voteList.css';

const VoteList = ({
  list, title, className, votes,
}) => (
  <React.Fragment>
  {list.length > 0 ?
    <section>
      <label>{title} ({list.length})</label>
      <label>
        <div className={`${styles.votesContainer} ${className}`} >
          {list.map(vote => (
           <span key={vote} className={`${styles.voteTag} vote`}>
            <span className={styles.rank}>#{votes[vote].rank}</span>
            <span className={styles.username}>{vote}</span>
           </span>
          ))}
        </div>
      </label>
    </section> :
    null }
  </React.Fragment>
);

VoteList.defaultProps = {
  list: [],
  title: '',
  className: '',
  votes: {},
};

export default VoteList;
