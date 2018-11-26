import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { FontIcon } from '../fontIcon';
import styles from './receive.css';

class ReceiveHowItWorks extends React.Component {
  componentDidMount() {
    if (!this.props.isMessage && this.props.status === 'foward') {
      this.props.nextStep({ status: 'backward' });
    }

    if (!this.props.isMessage && this.props.status === 'backward') {
      this.props.prevStep();
    }
  }

  render() {
    const { address } = this.props;
    return (
      <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']} ${styles.message}`}>
        <div className={`${grid['col-xs-10']} ${grid['col-sm-8']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
          <div className={styles.closeIcon}
            onClick={() => {
              this.props.nextStep({ address });
              this.props.settingsUpdated({ requestMessage: false });
              }}>
            <FontIcon value='close'/>
          </div>
          <h3>{this.props.t('How it works')}</h3>
          <p>{this.props.t(`Hub enables you to customize a link. Once shared with your peers,
            this link can be used to open any Lisk application and pre-fill the data for you.`)}</p>
          <p>{this.props.t('You can customize amount & message.')}</p>
        </div>
      </div>
    );
  }
}

export default ReceiveHowItWorks;
