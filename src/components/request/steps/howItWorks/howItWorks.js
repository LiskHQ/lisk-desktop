import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { ActionButton } from '../../../toolbox/buttons/button';
import Piwik from '../../../../utils/piwik';
import styles from '../../receive.css';

class HowItWorks extends React.Component {
  componentDidMount() {
    if (this.props.isRequestHowItWorksDisable && this.props.status === 'foward') this.props.nextStep({ status: 'foward' });
  }

  disableAndContinue() {
    Piwik.trackingEvent('Request_HowItWorks', 'button', 'Disable and continue');
    this.props.settingsUpdated({ isRequestHowItWorksDisable: true });
    this.props.nextStep({ address: this.props.address, status: 'foward' });
  }

  render() {
    return (
      <div>
        <div className={`${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']} ${styles.message}`}>
          <div className={`${grid['col-xs-10']} ${grid['col-sm-8']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <h3>{this.props.t('How it works')}</h3>
            <p>{this.props.t(`Hub enables you to customize a link. Once shared with your peers,
              this link can be used to open any Lisk application and pre-fill the data for you.`)}</p>
            <p>{this.props.t('You can customize amount & message.')}</p>
          </div>

          <footer>
          <ActionButton className={'okay-button'} onClick={() => this.disableAndContinue()} >
            {this.props.t('Okay')}
          </ActionButton>
        </footer>
        </div>
      </div>
    );
  }
}

export default HowItWorks;
