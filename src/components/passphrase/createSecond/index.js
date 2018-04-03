import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import styles from '../create/create.css';
import ProgressBarTheme from './progressBar.css';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import { PrimaryButton } from '../../toolbox/buttons/button';
import { fromRawLsk } from '../../../utils/lsk';
import fees from '../../../constants/fees';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'info',
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

  componentWillUnmount() {
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    document.removeEventListener(eventName, this.seedGeneratorBoundToThis, true);
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
    const { nextStep } = this.props;
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
      this.setState({ passphrase });
      setTimeout(() => {
        nextStep({
          passphrase,
        });
      }, 300);
    }
  }

  next() {
    this.container = document.getElementById('generatorContainer');
    this.isTouchDevice = this.checkDevice(this.props.agent);
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';
    window.addEventListener(eventName, this.eventNormalizer, true);
    this.setState({
      step: 'generate',
    });
  }

  render() {
    const { t, balance } = this.props;
    const hasFund = fromRawLsk(balance) * 1 < fromRawLsk(fees.setSecondPassphrase) * 1;
    const percentage = this.state.data ? this.state.data.percentage : 0;
    const hintTitle = this.isTouchDevice ?
      t('by tilting your device.') :
      t('by moving your mouse.');

    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} id="generatorContainer" >
        <TransitionWrapper current={this.state.step} step='info'>
          <div className={styles.secondPassphrase}
            ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
            <header>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {t('Secure the use of your Lisk ID')}
                <br />
                {t('with a 2nd passphrase')}
              </h2>
            </header>
            <p className={styles.info}>
              {t('After registration, you will need it to use your Lisk ID, like sending and voting.')}
              <br />
              {t('You are responsible for keeping your 2nd passphrase safe. No one can restore it, not even Lisk.')}
            </p>
            <PrimaryButton
              className={`${styles.nextButton} next`}
              disabled={hasFund}
              label={t('Next')}
              onClick={this.next.bind(this)}
              type={'button'} />
            {hasFund ? <p className={styles.error}>
              {t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(fees.setSecondPassphrase) })}
            </p> : '' }
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='generate'>
          <div className={styles.secondPassphrase}
            ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
            <header>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {t('Create your second passphrase')}
                <br/>
                {hintTitle}
              </h2>
            </header>
            <ProgressBar
              theme={ProgressBarTheme}
              mode='determinate'
              value={percentage} />
          </div>
        </TransitionWrapper>
      </section>
    );
  }
}

export default Create;
