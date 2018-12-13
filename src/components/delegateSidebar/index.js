import React from 'react';
import Box from '../box';
import MultiStep from '../multiStep';
import ConfirmVotes from '../confirmVotes';
import VotesPreview from '../votesPreview';
import PassphraseSteps from '../passphraseSteps';
import styles from './delegateSidebar.css';
import ResultBox from '../resultBox';

const DelegateSidebar = props => (
  <Box className={`confirm-votes ${styles.box}`}>
    <MultiStep className={styles.wrapper}>
      <VotesPreview votes={props.votes}
        nextStepGotCalled={props.nextStepGotCalled}
        updateList={(value) => { props.updateList(value); }}
        onMount={props.setLayover} />
      <PassphraseSteps onMount={props.setLayover} />
      <ConfirmVotes
        updateList={(value) => { props.updateList(value); }}
        onMount={props.setLayover}/>
      <ResultBox onMount={props.setLayover}/>
    </MultiStep>
  </Box>
);

export default DelegateSidebar;
