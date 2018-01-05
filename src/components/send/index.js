import React from 'react';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import styles from './styles.css';

class Send extends React.Component {
  constructor() {
    super();
    this.state = {
      sendIsActive: false,
    };
  }

  setSendIsActive(sendIsActive) {
    console.log('setSendIsActive', sendIsActive);
    this.setState({ sendIsActive });
  }

  render() {
    return (
      <Box className={`${styles.send} ${this.state.sendIsActive ? styles.isActive : ''}`}>
        <span className={`${styles.mobileMenu} ${this.state.sendIsActive ? styles.isHidden : ''}`}>
          <span className={styles.mobileMenuItem}
            onClick={this.setSendIsActive.bind(this, true)}>
            {('Send')}
          </span>
        </span>
        <span className={styles.mobileClose} onClick={this.setSendIsActive.bind(this, false)}>
          {('Close')} <FontIcon value='close' />
        </span>
        <MultiStep finalCallback={this.setSendIsActive.bind(this, false)}>
          <SendWritable/>
          <SendReadable />
          <ResultBox />
        </MultiStep>
      </Box>
    );
  }
}

export default Send;

