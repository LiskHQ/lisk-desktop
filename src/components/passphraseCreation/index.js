import React from 'react';
import { generateSeed, generatePassphrase } from './../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import isMobile from '../../utils/isMobile';
import styles from './passphraseCreation.css';

class PassphraseCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'generate',
      address: null,
      headingClass: '',
    };
    this.isTouchDevice = isMobile();
    this.lastCaptured = {
      x: 0,
      y: 0,
      time: new Date(),
    };
    this.eventNormalizer = this._eventNormalizer.bind(this);
  }

  addEventListener() {
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    window.addEventListener(eventName, this.eventNormalizer, true);
  }

  componentWillUnmount() {
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    window.removeEventListener(eventName, this.eventNormalizer, true);
  }

  _eventNormalizer(e) {
    let x = 0;
    let y = 0;
    if (this.isTouchDevice) {
      const ratio = isMobile(this.props.agent, 'android') ? 10 : 1;
      x = e.rotationRate.alpha * ratio;
      y = e.rotationRate.beta * ratio;

      const deltaX = Math.abs(x - this.lastCaptured.x);
      const deltaY = Math.abs(y - this.lastCaptured.y);
      const time = new Date();

      const throttle = time - this.lastCaptured.time > Math.random() * 500;
      const deviceIsTilting = (Math.abs(x) > 10 || Math.abs(y) > 10)
        && (deltaX > 10 || deltaY > 10);

      if (deviceIsTilting && throttle) {
        this.seedGenerator.call(this, x, y, time);
      }
    } else {
      x = e.pageX;
      y = e.pageY;

      const deltaX = x - this.lastCaptured.x;
      const deltaY = y - this.lastCaptured.y;

      const mouseWasMovedSufficiently = Math.sqrt((deltaX ** 2) + (deltaY ** 2)) > 120;
      if (mouseWasMovedSufficiently) {
        this.seedGenerator.call(this, x, y);
      }
    }
  }

  seedGenerator(pageX, pageY, time) {
    if (!this.state.data || this.state.data.percentage < 100) {
      this.lastCaptured = {
        x: pageX,
        y: pageY,
        time,
      };

      // defining diffSeed to use for animating HEX numbers
      // note: in the first iteration data is undefined
      const data = generateSeed(this.state.data);
      this.setState({ data });
    } else if (this.state.data && this.state.data.percentage >= 100 && !this.state.passphrase) {
      // also change the step here
      const passphrase = generatePassphrase(this.state.data);
      const address = extractAddress(passphrase);
      this.setState({
        step: 'info',
        passphrase,
        address,
      });

      if (this.props.nextStep) {
        setTimeout(() => {
          this.props.nextStep({
            passphrase,
          });
        }, 300);
      }
    }
  }

  render() {
    const {
      data, address, step, passphrase,
    } = this.state;
    const percentage = data ? data.percentage : 0;
    const hintTitle = this.isTouchDevice ?
      this.props.t('by tilting your device.') :
      this.props.t('by moving your mouse.');

    return (
      <section id='generatorContainer' className={styles.generator}>
        {React.cloneElement(this.props.children, {
          percentage,
          hintTitle,
          address,
          step,
          passphrase,
          addEventListener: this.addEventListener.bind(this),
        })}
      </section>
    );
  }
}

export default PassphraseCreation;
