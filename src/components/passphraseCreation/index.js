import React from 'react';
import { generateSeed, generatePassphrase } from './../../utils/passphrase';
import { extractAddress } from '../../utils/account';

class PassphraseCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'generate',
      address: null,
      lastCaptured: {
        x: 0,
        y: 0,
      },
      headingClass: '',
    };
    this.isTouchDevice = false;
    this.lastCaptured = {
      x: 0,
      y: 0,
      time: new Date(),
    };
    this.count = 0;
    this.eventNormalizer = this._eventNormalizer.bind(this);
  }

  addEventListener() {
    this.isTouchDevice = this.checkDevice(this.props.agent);
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    window.addEventListener(eventName, this.eventNormalizer, true);
  }

  componentWillUnmount() {
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    window.removeEventListener(eventName, this.eventNormalizer, true);
  }

  /**
   * Tests useragent with a regexp and defines if the account is mobile device
   * it is on class so that we can mock it in unit tests
   *
   * @param {String} [agent] - The useragent string, This parameter is used for
   *  unit testing purpose
   * @returns {Boolean} - whether the agent represents a mobile device or not
   */
  // eslint-disable-next-line class-methods-use-this
  checkDevice(agent, os) {
    let reg = /iPad|iPhone|iPod/i;
    if (!os) {
      reg = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
    } else if (os === 'android') {
      reg = /android/i;
    }
    return (reg.test(agent || navigator.userAgent || navigator.vendor || window.opera));
  }

  _eventNormalizer(e) {
    let x = 0;
    let y = 0;
    let ratio = 1;
    if (this.isTouchDevice) {
      if (this.checkDevice(this.props.agent, 'android')) {
        ratio = 10;
      }
      x = e.rotationRate.alpha * ratio;
      y = e.rotationRate.beta * ratio;

      this.count += 1;

      const deltaX = Math.abs(x - this.lastCaptured.x);
      const deltaY = Math.abs(y - this.lastCaptured.y);
      const time = new Date();

      if ((Math.abs(x) > 10 || Math.abs(y)) && (deltaX > 10 || deltaY > 10)
        && (time - this.lastCaptured.time > Math.random() * 500)) {
        this.lastCaptured = { x, y, time };
        this.seedGenerator.call(this, x / 10, y / 10);
      }
    } else {
      x = e.pageX;
      y = e.pageY;

      if (typeof nativeEvent === 'string' || Math.sqrt(((x - this.state.lastCaptured.x) ** 2) +
          ((y - this.state.lastCaptured.y) ** 2)) > 120) {
        this.seedGenerator.call(this, x, y);
      }
    }
  }

  seedGenerator(pageX, pageY) {
    if (!this.state.data || this.state.data.percentage < 100) {
      this.setState({
        lastCaptured: {
          x: pageX,
          y: pageY,
        },
      });

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
    const { data, address, step, passphrase } = this.state;
    const percentage = data ? data.percentage : 0;
    const hintTitle = this.isTouchDevice ?
      this.props.t('by tilting your device.') :
      this.props.t('by moving your mouse.');

    return (
      <section id='generatorContainer'>
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
