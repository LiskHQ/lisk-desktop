import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../../toolbox/accountVisual';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import styles from './delegateProfile.css';

const DelegateVotesView = ({
  votes,
}) => (
  <Box>
    <BoxContent className={`${styles.votesContainer} votes-container`}>
      {votes.map((address, index) => (
        <div className={styles.voteItem} key={index}>
          <AccountVisual
            className={styles.accountVisual}
            // placeholder={status[field.name].isInvalid || !status[field.name].value}
            address={address}
            size={44}
          />
          <div className={styles.address}>{address}</div>
        </div>
      ))}
    </BoxContent>
  </Box>
);

export default DelegateVotesView;
