import React from 'react';
import { Link } from 'react-router-dom';
import { TertiaryButtonV2 } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import styles from './loading.css';
import svgIcons from '../../utils/svgIcons';

class Loading extends React.Component {
  componentDidMount() {
    this.goNextIfDeviceConnected();
  }

  componentDidUpdate() {
    this.goNextIfDeviceConnected();
  }

  goNextIfDeviceConnected() {
    if (this.props.devices.length > 0) {
      this.props.nextStep();
    }
  }

  render() {
    const { t } = this.props;
    return <div>
      <h1>{t('Connect your Hardware Wallet')}</h1>
      <p>{t('Lisk Hub currently supports Ledger Nano S and Trezor wallets')}</p>
      <img src={svgIcons.iconLoader} className={styles.loadingIcon} />
      <p>{t('Looking for a device...')}</p>
      <Link to={routes.splashscreen.path}>
        <TertiaryButtonV2>
          {t('Go Back')}
        </TertiaryButtonV2>
      </Link>
    </div>;
  }
}

export default Loading;
