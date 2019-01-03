import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import ChooseAvatar from './chooseAvatar';
import HeaderV2 from '../headerV2/headerV2';
import styles from './registerV2.css';

class RegisterV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: '',
      previousAddress: '',
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  handleSelectAvatar(address) {
    const { selectedAddress } = this.state;
    this.setState({
      selectedAddress: address,
      previousAddress: selectedAddress,
    });
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <HeaderV2 showSettings={false} />
        <div className={`${styles.register} ${grid.row}`}>
          <div className={`${styles.wrapper} ${grid['col-sm-8']}`}>
            <span className={`${styles.stepsLabel}`}>{t('Step')} {'1 / 4'}</span>
            <ChooseAvatar
              addresses={this.state.addresses}
              selected={this.state.selectedAddress}
              handleSelectAvatar={this.handleSelectAvatar}
              previousAddress={this.state.previousAddress}
              />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(RegisterV2);
