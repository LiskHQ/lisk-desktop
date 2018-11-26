import React, { Component } from 'react';
import MultiStep from '../multiStep';
import ReceiveDescription from './receiveDescription';
import ReceiveHowItWorks from './receiveHowItWorks';
import ReceiveConfirmation from './receiveConfirmation';
import Box from '../box';
import url from '../../../test/constants/urls';
import styles from './receive.css';

class Receive extends Component {
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
          <ReceiveDescription
            t={this.props.t}
            address={this.props.address}
            goToTransationPage={this.goToTransationPage}
          />
          <ReceiveHowItWorks
            t={this.props.t}
            address={this.props.address}
            isMessage={this.props.isMessage}
            settingsUpdated={this.props.settingsUpdated}
          />
          <ReceiveConfirmation
            t={this.props.t}
            address={this.props.address}
            goToTransationPage={this.goToTransationPage}
          />
        </MultiStep>
      </Box>
    );
  }
}

export default Receive;
