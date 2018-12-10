import React, { Component } from 'react';
import MultiStep from '../multiStep';
import Description from './steps/description/description';
import HowItWorks from './steps/howItWorks/howItWorks';
import Confirmation from './steps/confirmation/confirmation';
import Box from '../box';
import url from '../../../test/constants/urls';
import styles from './receive.css';

class Request extends Component {
  constructor(props) {
    super(props);

    this.goToTransationPage = this.goToTransationPage.bind(this);
  }

  goToTransationPage() {
    this.props.history.push(url.wallet);
  }

  render() {
    return (
      <Box className={styles.wrapper}>
        <MultiStep key='request'>
          <Description
            t={this.props.t}
            address={this.props.address || ''}
            goToTransationPage={this.goToTransationPage}
          />
          <HowItWorks
            t={this.props.t}
            isRequestHowItWorksDisable={this.props.isRequestHowItWorksDisable}
            settingsUpdated={this.props.settingsUpdated}
          />
          <Confirmation
            t={this.props.t}
            address={this.props.address || ''}
            goToTransationPage={this.goToTransationPage}
          />
        </MultiStep>
      </Box>
    );
  }
}

export default Request;
