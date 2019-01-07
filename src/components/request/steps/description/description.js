import React from 'react';
import QRCode from 'qrcode.react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { FontIcon } from '../../../fontIcon';
import { Button, ActionButton } from '../../../toolbox/buttons/button';
import CopyToClipboard from '../../../copyToClipboard/index';
import Piwik from '../../../../utils/piwik';
import styles from '../../receive.css';

const Description = (props) => {
  const link = `lisk://wallet/send?recipient=${props.address}`;
  const text = `mailto:?subject=Requesting LSK to ${props.address}&body=Hey there,
    here is a link you can use to send me LSK via your wallet: ${encodeURIComponent(link)}`;

  function onPrevStep() {
    Piwik.trackingEvent('Request_Description', 'button', 'Previous step');
    props.goToTransationPage();
  }

  function onNextStep() {
    Piwik.trackingEvent('Request_Description', 'button', 'Next step');
    props.nextStep({ address: props.address, status: 'foward' });
  }

  return (
    <div>
      <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
        <header className={`${grid['col-xs-10']} ${grid['col-sm-10']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
          <h3>{props.t('Request LSK')}</h3>
        </header>
      </div>

      <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
        <div className={`${styles.qrCode} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
          <QRCode value={props.address} />
          <CopyToClipboard
            value={props.address}
            className={`${styles.copy} request-link`}
          />
        </div>
        <div className={`${styles.transaction} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
          <p>
            {props.t('This is your Lisk ID shown as a QR code. You can scan it with our Lisk Mobileapp available on Google Play & the AppStore or any QR code reader.')}
          </p>
          <a
            href={text}
            className={'email-link'} >
            {props.t('Send request via E-mail')}
            <FontIcon value='external-link'/>
          </a>
        </div>
      </div>

      <footer className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
        <div className={`${grid['col-xs-3']} ${grid['col-sm-3']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
          <Button
            className={'back'}
            onClick={() => onPrevStep()}>
            {props.t('Back')}
          </Button>
        </div>

        <div className={`${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
          <ActionButton
            className={'specify-request'}
            onClick={() => onNextStep()}
            >
            {props.t('Request specific amount')}
          </ActionButton>
        </div>
      </footer>
    </div>
  );
};

export default Description;
