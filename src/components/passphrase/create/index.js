import React, { Fragment } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/api/account';
import AccountVisual from '../../accountVisual';
import styles from './create.css';
import { FontIcon } from '../../fontIcon';
import Shapes from './shapes';
import { PrimaryButton, Button } from '../../toolbox/buttons/button';
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
      shapes: [1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    this.isTouchDevice = this.checkDevice(this.props.agent);
    if (this.isTouchDevice) {
      window.addEventListener('devicemotion', this.eventNormalizer, true);
    }
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
      const phrase = generatePassphrase(this.state.data);
      const address = extractAddress(phrase);
      this.setState({
        passphrase: phrase,
        step: 'info',
        address,
      });

      const shapes = this.hideShapeRandomly(this.state.shapes);
      // update state
      this.setState({
        shapes,
      });
    }
  }

  showHint() {
    this.setState({ showHint: !this.state.showHint });
  }

  render() {
    const { t, nextStep } = this.props;
    const percentage = this.state.data ? this.state.data.percentage : 0;
    const hintTitle = this.isTouchDevice ? 'by tilting your device.' : 'by moving your mouse.';
    const modifyID = (id) => {
      const substring = id.slice(3, id.length - 1);
      const replacement = substring.replace(/.{1}/g, '*');
      return id.replace(substring, replacement);
    };

    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`}
        id='generatorContainer' ref={(el) => { this.container = el; }} onMouseMove={this.eventNormalizer} >
        <div className={grid['col-xs-12']}
          ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
          {!this.state.address ?
            <Shapes percentage={percentage} shapes={this.state.shapes} /> :
            null
          }
          <header>
            <TransitionWrapper current={this.state.step} step='generate'>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {this.props.t('Create your Lisk ID')}
                <br/>
                {this.props.t(hintTitle)}
              </h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='info'>
              <h2 className={`${styles.secondHeading}`}>
                {t('This is your Lisk ID')}
                <small onClick={this.showHint.bind(this)} className={this.state.showHint ? styles.hidden : ''}>
                  <FontIcon value='info'></FontIcon>
                  {t('What is Lisk ID?')}
                </small>
              </h2>
            </TransitionWrapper>
            <aside className={`${styles.description} ${this.state.step === 'info' && this.state.showHint ? styles.fadeIn : ''}`}>
              <p>The <b>Avatar</b> represents the ID making it easy to recognize.
                Every Lisk ID has one unique avatar.</p>
              <p>The <b>ID</b> is unique and can’t be changed. It’s yours.
                You will get the full <b>ID</b> at the end.</p>
              <Button
                label={t('Got it')}
                onClick={this.showHint.bind(this)}
                type={'button'} />
            </aside>
          </header>
          {this.state.address ?
            <Fragment>
              <figure>
                <AccountVisual address={this.state.address} size={200} />
              </figure>
              <h4 className={styles.address}>{modifyID(this.state.address)}</h4>
              <PrimaryButton
                theme={styles}
                label='Get passphrase'
                className="get-passphrase-button"
                onClick={() => nextStep({
                  passphrase: this.state.passphrase,
                  header: t('Your passphrase is used to access your Lisk ID.'),
                  message: t('I am responsible for keeping my passphrase safe. No one can reset it, not even Lisk.'),
                })}
              />
            </Fragment>
            : ''}
        </div>
      </section>
    );
  }
}

export default Create;
