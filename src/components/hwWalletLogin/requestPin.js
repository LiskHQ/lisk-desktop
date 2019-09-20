import React from 'react';
import externalLinks from '../../constants/externalLinks';
import { MaskedInput } from '../toolbox/inputs';
import { getPublicKey, validateTrezorOnePin } from '../../utils/hwManager';
import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import routes from '../../constants/routes';
import styles from './requestPin.css';

class RequestPin extends React.Component {
  constructor() {
    super();

    this.state = {
      pin: '',
      error: false,
      feedback: '',
    };

    this.requestPin = this.requestPin.bind(this);
    this.onSelectedDevice = this.onSelectedDevice.bind(this);
    this.checkIfIsCorrectDevice = this.checkIfIsCorrectDevice.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onSubmitPin = this.onSubmitPin.bind(this);
    this.retry = this.retry.bind(this);
  }

  componentDidMount() {
    this.checkIfIsCorrectDevice();
  }

  async requestPin() {
    const { t } = this.props;
    const deviceId = this.props.deviceId;
    const res = await getPublicKey({ index: 0, deviceId });
    if (res) {
      this.props.nextStep({ deviceId });
    } else {
      this.setState({ error: true, feedback: t('Invalid PIN') });
    }
  }

  onSelectedDevice() {
    return this.props.devices.find(device => device.deviceId === this.props.deviceId);
  }

  checkIfIsCorrectDevice() {
    const { nextStep, deviceId } = this.props;
    const actualDevice = this.onSelectedDevice();
    if (actualDevice.model !== 'Trezor Model One') nextStep({ deviceId });
    this.requestPin();
  }

  retry() {
    this.setState({ error: false, feedback: '' });
    this.requestPin();
  }

  onButtonClicked(e) {
    e.stopPropagation();
    if (this.state.error) this.retry();
    this.setState({ pin: `${this.state.pin}${e.target.value}` });
  }

  onSubmitPin(e) {
    e.preventDefault();
    validateTrezorOnePin(this.state.pin);
  }

  render() {
    const { error, feedback, pin } = this.state;
    const { t, history } = this.props;
    const device = this.onSelectedDevice();

    return (
      <div>
        <h1>{t('{{deviceModel}} connected! Please provide a PIN number', { deviceModel: device.model })}</h1>
        <p>
          { t('If you’re not sure how to do this please follow the') }
          {' '}
          <a
            href={externalLinks.trezorOneHelp}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Official guidelines')}
          </a>
        </p>

        <div className={styles.content}>
          <div className={styles.gridContainer}>
            <MaskedInput
              error={error}
              feedback={feedback}
              maxLength="9"
              type="password"
              value={pin}
            />

            <div className={styles.gridSystem}>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="7" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="8" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="9" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="4" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="5" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="6" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="1" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="2" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="3" />
              </div>
            </div>

            <div className={styles.buttonsContainer}>
              <PrimaryButton
                className="primary-btn"
                onClick={this.onSubmitPin}
                disabled={error}
              >
                {t('Enter PIN')}
              </PrimaryButton>
              <TertiaryButton
                className="tertiary-btn"
                onClick={() => { history.push(routes.splashscreen.path); }}
              >
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
