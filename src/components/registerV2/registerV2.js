import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import ChooseAvatar from './chooseAvatar';
import styles from './registerV2.css';

class RegisterV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: '',
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  handleSelectAvatar(address) {
    this.setState({
      selectedAddress: address,
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className={`${styles.register} ${grid.row}`}>
        <div className={`${styles.wrapper} ${grid['col-sm-8']}`}>
          <span className={`${styles.stepsLabel}`}>{t('Step')} {'1 / 4'}</span>
          <ChooseAvatar
            addresses={this.state.addresses}
            selected={this.state.selectedAddress}
            handleSelectAvatar={this.handleSelectAvatar}
            />
        </div>
      </div>
    );
  }
}

export default translate()(RegisterV2);
