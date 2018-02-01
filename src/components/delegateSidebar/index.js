import React from 'react';
import Box from '../box';
import MultiStep from './../multiStep';
import ConfirmVotes from '../confirmVotes';
import VotesPreview from '../votesPreview';
import PassphraseSteps from './../passphraseSteps';
import styles from './delegateSidebar.css';

const DelegateSidebar = ({ votes }) => (
  <Box className='confirm-votes' finalCallback={() => {}}>
    <MultiStep className={styles.wrapper}>
      <VotesPreview votes={votes} />
      <PassphraseSteps />
      <ConfirmVotes />
    </MultiStep>
  </Box>
);

export default DelegateSidebar;
