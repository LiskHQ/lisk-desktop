import React from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import PassphraseSteps from './../passphraseSteps';
import { parseSearchParams } from './../../utils/searchParams';
import styles from './styles.css';

class Send extends React.Component {
  constructor(props) {
    super(props);
    this.address = parseSearchParams(props.location.search).address;
    this.state = {
      sendIsActive: !!this.address || false,
    };
  }

  setSendIsActive(sendIsActive) {
    this.setState({ sendIsActive });
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <span className={styles.mobileMenu}>
          <span className={`send-menu-item ${styles.mobileMenuItem}`}
            onClick={this.setSendIsActive.bind(this, true)}>
            {t('Send')}
          </span>
        </span>
        <Box className={`send-box ${styles.send} ${this.state.sendIsActive ? styles.isActive : ''}`}>
          <span className={`mobile-close-button ${styles.mobileClose}`}
            onClick={this.setSendIsActive.bind(this, false)}>
            {t('Close')} <FontIcon value='close' />
          </span>
          <MultiStep finalCallback={this.setSendIsActive.bind(this, false)}
            className={styles.wrapper}>
            <SendWritable
              autoFocus={this.state.sendIsActive || window.innerWidth > 1024}
              address={this.address}
            />
            <PassphraseSteps />
            <SendReadable />
            <ResultBox />
          </MultiStep>
        </Box>
      </div>
    );
  }
}

export default withRouter(translate()(Send));

