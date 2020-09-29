import React from 'react';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import Icon from '../../toolbox/icon';


const VotingQueue = () => {
  console.log('mounted');
  return (
    <section>
      <Box>
        <BoxHeader>
          <Icon name="votingQueueActive" />
        </BoxHeader>
      </Box>
    </section>
  );
};

export default VotingQueue;
