import React from 'react';
import QRCode from 'qrcode.react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, TertiaryButton } from './../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import Input from '../toolbox/inputs/input';
import { FontIcon } from '../fontIcon';
import CopyToClipboard from '../copyToClipboard/index';
import styles from './request.css';
import inputTheme from './input.css';

class ConfirmRequest extends React.Component {
  constructor() {
    super();
    this.state = { magnifyQrCode: false };
  }

  render() {
    const {
      address, amount, reference, prevStep, finalCallback, t,
    } = this.props;
    let link = `lisk://wallet?recipient=${address}&amount=${amount}`;
    link = reference ? `${link}&reference=${encodeURIComponent(reference)}` : link;

    return (
      <div className={`${styles.wrapper} confirm-request-step`}>
        <div className={styles.header}>
          <header>
            <h2>{t('Your request')}</h2>
          </header>
        </div>
        <div>
          <Input label={t('Receiver')}
            className={`recipient ${styles.disabledInput}`}
            value={address}
            theme={inputTheme}
            disabled={true}>
            <figure className={styles.accountVisual}>
              <AccountVisual address={address} size={50} />
            </figure>
          </Input>

          {reference ?
            <Input label={t('Reference')}
              className={`recipient ${styles.disabledInput}`}
              value={reference}
              disabled={true}/> : null}

          <Input label={t('Request amount (LSK)')}
            className={`recipient ${styles.disabledInput}`}
            value={amount}
            disabled={true}/>
          <div className={`${styles.qrCode} ${this.state.magnifyQrCode ? styles.magnified : styles.minimized} qr-code`}
            onClick={() => this.setState({ magnifyQrCode: !this.state.magnifyQrCode })}>
            <QRCode value={link}/>
          </div>
          <CopyToClipboard
            value={link}
            className={styles.copy}/>
          <a className={styles.emailLink}
            href={`mailto:?subject=Request ${amount} LSK to ${address}&body=Hey there, here is a link you can use to send me ${amount} LSK via your wallet: ${encodeURIComponent(link)}`}>
            {t('Send request via E-mail')} <FontIcon value='arrow-right'/>
          </a>
        </div>
        <footer>
          <section className={grid.row} >
            <div className={grid['col-xs-4']}>
              <Button
                className={`${styles.backButton} back-button`}
                label={t('Back')}
                onClick={() => prevStep()}
              />
            </div>
            <div className={grid['col-xs-8']}>
              <TertiaryButton
                label={t("Okay, I'm done")}
                onClick={() => finalCallback()}
                className='finish-button'
              />
              <div className='subTitle'></div>
            </div>
          </section>
        </footer>
      </div>
    );
  }
}

export default ConfirmRequest;
