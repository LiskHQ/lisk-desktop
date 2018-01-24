import React, { Fragment } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/api/account';
import AccountVisual from '../../accountVisual';
import styles from './create.css';
import ProgressBar from '../../toolbox/progressBar/progressBar';
import * as shapesSrc from '../../../assets/images/register-shapes/*.svg'; //eslint-disable-line
import MovableShape from './movableShape';
import { PrimaryButton } from '../../toolbox/buttons/button';
import TransitionWrapper from '../../toolbox/transitionWrapper';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'generate',
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
    this.moveTitle();
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
  checkDevice(agent) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent || navigator.userAgent || navigator.vendor || window.opera));
  }

  _eventNormalizer(e) {
    let x = 0;
    let y = 0;
    if (this.isTouchDevice) {
      x = e.rotationRate.alpha;
      y = e.rotationRate.beta;

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

  render() {
    const { t, nextStep } = this.props;
    const { shapes } = this.state;
    const percentage = this.state.data ? this.state.data.percentage : 0;

    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} id="generatorContainer" >
        <div className={grid['col-xs-12']}
          ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
          {!this.state.address ?
            <div className={styles.shapesWrapper}>
              <MovableShape
                hidden={shapes[0]}
                src={shapesSrc.circle}
                className={styles.circle}
                percentage={percentage}
                initial={['92%', '20%']} />
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
                hidden={shapes[3]}
                src={shapesSrc.smallTriangle}
                className={styles.smallTriangle}
                percentage={percentage}
                initial={['30%', '-2%']} />
              <MovableShape
                hidden={shapes[5]}
                src={shapesSrc.circleOutline}
                className={styles.circleOutline}
                percentage={percentage}
                initial={['-2%', '10%']} />
              <MovableShape
                hidden={shapes[6]}
                src={shapesSrc.stripe}
                className={styles.stripe}
                percentage={percentage}
                initial={['-4%', '5%']} />
              <MovableShape
                hidden={shapes[7]}
                src={shapesSrc.smallStripe}
                className={styles.smallStripe}
                percentage={percentage}
                initial={['20%', '4%']} />
              <MovableShape
                hidden={shapes[4]}
                src={shapesSrc.rightRectangle}
                className={styles.rightRectangle}
                percentage={percentage}
                initial={['40%', '-1%']} />
              <MovableShape
                hidden={shapes[8]}
                src={shapesSrc.leftRectangle}
                className={styles.leftRectangle}
                percentage={percentage}
                initial={['70%', '-5%']} />
            </div> :
            null
          }
          <header className={this.state.headingClass}>
            <TransitionWrapper current={this.state.step} step='generate'>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {this.props.t('Create your Lisk ID')}
                <br/>
                {this.props.t('by moving your mouse.')}
              </h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='info'>
              <h2 className={`${styles.secondHeading}`}>
                {t('Create your Lisk ID')}
                <small>{t('This is your Lisk-ID consisting of an address and avatar.')}</small>
              </h2>
            </TransitionWrapper>
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
        <footer className={grid['col-xs-12']}>
          <ProgressBar mode='determinate' theme={styles}
            value={percentage} />
        </footer>
      </section>
    );
  }
}

export default Create;
