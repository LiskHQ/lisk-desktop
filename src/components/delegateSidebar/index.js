import React from 'react';
import Box from '../box';
import MultiStep from './../multiStep';
import ConfirmVotes from '../confirmVotes';
import VotesPreview from '../votesPreview';
import PassphraseSteps from './../passphraseSteps';
import styles from './delegateSidebar.css';
import ResultBox from '../resultBox';

class DelegateSidebar extends React.Component {
  constructor() {
    super();
    this.state = { isLayover: false };
  }

  updateList(value) {
    this.props.updateList(value);
  }

  setLayoverStatus(isLayover) {
    if (isLayover) {
      document.getElementById('votingComponent').classList.add('hasLayover');
    } else {
      document.getElementById('votingComponent').classList.remove('hasLayover');
    }
    this.setState({ isLayover });
  }

  render() {
    return (
      <Box className={`confirm-votes ${styles.box} ${this.state.isLayover ? styles.layover : ''}`}>
        <MultiStep className={styles.wrapper} finalCallback={() => true}>
          <VotesPreview votes={this.props.votes}
            updateList={(value) => { this.updateList.call(this, value); }}
            onMount={this.setLayoverStatus.bind(this)}/>
          <PassphraseSteps onMount={this.setLayoverStatus.bind(this)} />
          <ConfirmVotes
            updateList={(value) => { this.updateList.call(this, value); }}
            onMount={this.setLayoverStatus.bind(this)}/>
          <ResultBox onMount={this.setLayoverStatus.bind(this)}/>
        </MultiStep>
      </Box>
    );
  }
}

export default DelegateSidebar;
