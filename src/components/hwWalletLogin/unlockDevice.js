import React from 'react';
import { TertiaryButtonV2 } from '../toolbox/buttons/button';
import illustration from '../../assets/images/illustrations/illustration-ledger-nano-light.svg';

class UnlockDevice extends React.Component {
  render() {
    const { t, prevStep, deviceModel = 'Ledger S' } = this.props;
    return <React.Fragment>
      <h1>{t('{{deviceModel}} connected! Open the Lisk app on the device', { deviceModel })}</h1>
      <p>
        {t('If you’re not sure how to do this please follow the')} <a href="">{t('Oficial guidelines')}</a>
      </p>
      <img src={illustration} />
      <TertiaryButtonV2 onClick={prevStep}>
        {t('Go Back')}
      </TertiaryButtonV2>
    </React.Fragment>;
  }
}

export default UnlockDevice;
