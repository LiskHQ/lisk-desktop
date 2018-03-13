import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import styles from '../create/create.css';
import ProgressBarTheme from './progressBar.css';
import TransitionWrapper from '../../toolbox/transitionWrapper';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'generate',
      showHint: false,
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

  componentDidMount() {
    this.container = document.getElementById('generatorContainer');
    this.isTouchDevice = this.checkDevice(this.props.agent);
    const eventName = this.isTouchDevice ? 'devicemotion' : 'mousemove';

    window.addEventListener(eventName, this.eventNormalizer, true);
  }


  moveTitle() {
    setTimeout(() => {
      const { percentage } = this.state.data;
      if (percentage > 15 && percentage < 18) {
        this.setState({
          headingClass: styles.goToTop,
        });
      }
    }, 10);
  }

  // eslint-disable-next-line class-methods-use-this
  hideShapeRandomly(list) {
    const result = [];
    const min = 0;
    const max = 9;
    let randomNumber;
    while (result.length < 4) {
      randomNumber = Math.floor((Math.random() * (max - min)) + min);
      if (result.indexOf(randomNumber) === -1) {
        result.push(randomNumber);
      }
    }
    result.forEach((item) => { list[item] = 0; });
    return list;
  }

  componentDidUpdate() {
    if (this.state.data) {
      this.moveTitle();
    }
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
    const { t, nextStep } = this.props;
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
          step: 'info',
          header: t('Secure the use of your Lisk ID with a second passphrase.'),
          message: t('You will need it to use your Lisk ID, like sending and voting. You are responsible for keeping your second passphrase safe. No one can restore it, not even Lisk.'),
        });
      }, 300);
    }
  }

  showHint() {
    this.setState({ showHint: !this.state.showHint });
  }

  render() {
    const { t } = this.props;
    const percentage = this.state.data ? this.state.data.percentage : 0;
    const hintTitle = this.isTouchDevice ?
      t('by tilting your device.') :
      t('by moving your mouse.');

    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} id="generatorContainer" >
        <TransitionWrapper current={this.state.step} step='generate'>
          <div className={styles.secondPassphrase}
            ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
            <header className={this.state.headingClass}>
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
