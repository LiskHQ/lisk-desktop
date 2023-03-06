import { to } from 'await-to-js';
import React from 'react';
import hwManager from '@hardwareWallet/manager/HWManager';
import { externalLinks } from 'src/utils/externalLinks';
import { Input } from 'src/theme';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import { validatePin } from '@libs/hwServer/communication';
import styles from './requestPin.css';

class RequestPin extends React.Component {
  constructor() {
    super();

    this.state = {
      pin: '',
      error: false,
      feedback: '',
    };

    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onSubmitPin = this.onSubmitPin.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    const { nextStep, deviceId } = this.props;
    if (this.selectedDevice.model !== 'Trezor Model One') {
      nextStep({ deviceId });
    } else this.checkDeviceUnlocked();
  }

  async checkDeviceUnlocked() {
    const { t, deviceId } = this.props;
    this.setState({ error: false, feedback: '' });
    const res = await hwManager.getPublicKey(0);
    if (res) {
      this.props.nextStep({ deviceId });
    } else {
      this.setState({ error: true, feedback: t('Invalid PIN') });
    }
  }

  get selectedDevice() {
    return this.props.devices.find((device) => device.deviceId === this.props.deviceId);
  }

  onButtonClicked(e) {
    e.stopPropagation();
    if (this.state.error) this.checkDeviceUnlocked();
    const { value } = e.target;
    this.setState(({ pin }) => ({ pin: `${pin}${value}` }));
  }

  onInputChange({ target: { value } }) {
    value = value.replace(/[^\d]/g, '');
    this.setState({ pin: value });
  }

  async onSubmitPin(e) {
    e.preventDefault();
    const { pin } = this.state;
    const { deviceId, t, nextStep } = this.props;
    this.setState({ isLoading: true });
    const [error] = await to(validatePin({ deviceId, pin }));
    if (error) {
      this.setState({
        isLoading: false,
        error: true,
        feedback: t('Invalid PIN'),
        pin: '',
      });
    } else if (this.mounted) {
      nextStep({ deviceId });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { error, feedback, pin, isLoading } = this.state;
    const { t, goBack } = this.props;
    const device = this.selectedDevice;

    return (
      <div className={styles.wrapper}>
        <h1>
          {t('{{deviceModel}} connected! Please provide a PIN number', {
            deviceModel: device.model,
          })}
        </h1>
        <p>
          {t('If you’re not sure how to do this please follow the')}{' '}
          <a href={externalLinks.trezorOneHelp} target="_blank" rel="noopener noreferrer">
            {t('Official guidelines')}
          </a>
        </p>

        <div className={styles.content}>
          <div className={styles.gridContainer}>
            <Input
              className="pin"
              isMasked
              isLoading={isLoading}
              error={error}
              feedback={feedback}
              maxLength="9"
              type="password"
              value={pin}
              onChange={this.onInputChange}
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
                disabled={!pin || isLoading}
              >
                {t('Unlock')}
              </PrimaryButton>
              <TertiaryButton className="tertiary-btn" onClick={goBack}>
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
