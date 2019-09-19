import React from 'react';
import externalLinks from '../../constants/externalLinks';
import { MaskedInput } from '../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import styles from './requestPin.css';

class RequestPin extends React.Component {
  constructor() {
    super();

    this.state = {
      pin: '',
    };

    this.requestPin = this.requestPin.bind(this);
    this.onSelectedDevice = this.onSelectedDevice.bind(this);
    this.checkIfIsCorrectDevice = this.checkIfIsCorrectDevice.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  componentDidMount() {
    this.checkIfIsCorrectDevice();
  }

  // eslint-disable-next-line class-methods-use-this
  requestPin() {
    console.log('request');
  }

  onSelectedDevice() {
    return this.props.devices.find(device => device.deviceId === this.props.deviceId);
  }

  checkIfIsCorrectDevice() {
    const { nextStep, deviceId } = this.props;
    const actualDevice = this.onSelectedDevice();

    if (actualDevice.model !== 'Trezor Model One') {
      nextStep({ deviceId });
    }
  }

  onButtonClicked(e) {
    e.stopPropagation();
    this.setState({ pin: `${this.state.pin}${e.target.value}` });
  }

  onSubmitPin(e) {
    e.preventDefault();
    console.log(this.state.pin);
  }

  render() {
    const { t, history } = this.props;

    return (
      <div>
        <h1>{t('{{deviceModel}} connected! Please provide a PIN number', { deviceModel: 'Trezor Model One' })}</h1>
        <p>
          { t('If you’re not sure how to do this please follow the') }
          {' '}
          <a
            href={externalLinks.ledgerNanoSHelp}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Official guidelines')}
          </a>
        </p>

        <div className={styles.content}>
          <div className={styles.gridContainer}>
            <MaskedInput
              type="password"
              value={this.state.pin}
            />

            <div className={styles.gridSystem}>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="1" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="2" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="3" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="4" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="5" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="6" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="7" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="8" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="9" />
              </div>
            </div>

            <div className={styles.footerBtns}>
              <PrimaryButton onClick={this.onSubmitPin}>{t('Enter PIN')}</PrimaryButton>
              <TertiaryButton onClick={() => { history.push(routes.splashscreen.path); }}>
                {t('Go back')}
              </TertiaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestPin;
