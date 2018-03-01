import React, { Fragment } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/api/account';
import AccountVisual from '../../accountVisual';
import styles from './create.css';
import { FontIcon } from '../../fontIcon';
import * as shapesSrc from '../../../assets/images/register-shapes/*.svg'; //eslint-disable-line
import MovableShape from './movableShape';
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
    const { shapes } = this.state;
    const percentage = this.state.data ? this.state.data.percentage : 0;
    const hintTitle = this.isTouchDevice ? 'by tilting your device.' : 'by moving your mouse.';

    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`}
        id='generatorContainer' ref={(el) => { this.container = el; }} onMouseMove={this.eventNormalizer} >
        <div className={grid['col-xs-12']}
          ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
          {!this.state.address ?
            <div className={styles.shapesWrapper}>
              <MovableShape
                hidden={shapes[0]}
                src={shapesSrc.circle}
                className={styles.circle}
                percentage={percentage}
                initial={['100%', '20%']} />
              <MovableShape
                hidden={shapes[1]}
                src={shapesSrc.smallCircle}
                className={styles.smallCircle}
                percentage={percentage}
                initial={['62%', '-2%']} />
              <MovableShape
                hidden={shapes[2]}
                src={shapesSrc.triangle}
                className={styles.triangle}
                percentage={percentage}
                initial={['80%', '-2%']} />
              <MovableShape
                hidden={shapes[4]}
                src={shapesSrc.squareLeft}
                className={styles.squareLeft}
                percentage={percentage}
                initial={['5%', '-1%']} />
              <MovableShape
                hidden={shapes[8]}
                src={shapesSrc.squareRight}
                className={styles.squareRight}
                percentage={percentage}
                initial={['70%', '-5%']} />
              <MovableShape
                hidden={shapes[5]}
                src={shapesSrc.triangleLeft}
                className={styles.triangleLeft}
                percentage={percentage}
                initial={['-2%', '30%']} />
              <MovableShape
                hidden={shapes[7]}
                src={shapesSrc.circleLeft}
                className={styles.circleLeft}
                percentage={percentage}
                initial={['20%', '2%']} />
              <MovableShape
                hidden={shapes[3]}
                src={shapesSrc.smallTriangle}
                className={styles.smallTriangle}
                percentage={percentage}
                initial={['40%', '-2%']} />
              <MovableShape
                hidden={shapes[6]}
                src={shapesSrc.verySmallCircle}
                className={styles.verySmallCircle}
                percentage={percentage}
                initial={['45%', '0%']} />
            </div> :
            null
          }
          <header className={this.state.headingClass}>
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
              <p>The <b>ID</b> is unique and can’t be changed. It’s yours.</p>
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
              <h4 className={styles.address}>{this.state.address}</h4>
              <PrimaryButton
                theme={styles}
                label='Get passphrase'
                className="get-passphrase-button"
                onClick={() => nextStep({ passphrase: this.state.passphrase })}
              />
            </Fragment>
            : ''}
        </div>
      </section>
    );
  }
}

export default Create;
