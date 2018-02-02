import React from 'react';
import Box from '../box';
import MultiStep from './../multiStep';
import ConfirmVotes from '../confirmVotes';
import VotesPreview from '../votesPreview';
import PassphraseSteps from './../passphraseSteps';
import styles from './delegateSidebar.css';
import ResultBox from '../resultBox';

const DelegateSidebar = ({ votes }) => (
  <Box className='confirm-votes'>
    <MultiStep className={styles.wrapper} finalCallback={() => true}>
      <VotesPreview votes={votes} />
      <PassphraseSteps />
      <ConfirmVotes />
      <ResultBox />
    </MultiStep>
  </Box>
);

export default DelegateSidebar;
