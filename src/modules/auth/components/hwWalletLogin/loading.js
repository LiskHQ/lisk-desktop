import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { TertiaryButton } from '@theme/buttons';
import LoadingIcon from './loadingIcon';

class Loading extends React.Component {
  componentDidMount() {
    this.goNextIfDeviceConnected();
  }

  componentDidUpdate() {
    this.goNextIfDeviceConnected();
  }

  goNextIfDeviceConnected() {
    if (this.props.devices.length > 0 && this.props.network.name) {
      this.props.nextStep();
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <h1>{t('Connect your Hardware Wallet')}</h1>
        <p>
          {t('Lisk currently supports Ledger Nano S, Ledger Nano X wallets')}
        </p>
        <LoadingIcon />
        <p>{t('Looking for a device...')}</p>
        <Link to={routes.login.path}>
          <TertiaryButton>{t('Go back')}</TertiaryButton>
        </Link>
      </div>
    );
  }
}

export default Loading;
