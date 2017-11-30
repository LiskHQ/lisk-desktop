import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, emptyByte, generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/api/account';
import styles from './passphrase.css';
import Input from '../toolbox/inputs/input';
import ProgressBar from '../toolbox/progressBar/progressBar';
import * as shapes from '../../assets/images/register-shapes/*.svg'; //eslint-disable-line
import AnimateShape from './animateShape';
import { PrimaryButton } from '../toolbox/buttons/button';

class PassphraseGenerator extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'info',
      address: null,
      lastCaptured: {
        x: 0,
        y: 0,
      },
      firstHeadingClass: '',
      secondHeadingClass: '',
      headingClass: '',
      zeroSeed: emptyByte('00'),
      seedDiff: emptyByte(0),
    };
    this.shapes = [];
  }

  componentDidMount() {
    this.container = document.getElementById('generatorContainer');
    this.seedGeneratorBoundToThis = this.seedGenerator.bind(this);
    this.container.addEventListener('mousemove', this.seedGeneratorBoundToThis, true);

    this.shapes.push(new AnimateShape({ x: 550, y: 50 }, '#rCircle', true));
    this.shapes.push(new AnimateShape({ x: 450, y: 230 }, '#rTriangle', true));
    this.shapes.push(new AnimateShape({ x: 450, y: 180 }, '#rSmallTriangle', true));
    this.shapes.push(new AnimateShape({ x: 300, y: 220 }, '#rRightRectangle', true));
    this.shapes.push(new AnimateShape({ x: 250, y: 350 }, '#rCircleOutline', false));
    this.shapes.push(new AnimateShape({ x: 100, y: 200 }, '#rStripe', false));
    this.shapes.push(new AnimateShape({ x: 280, y: 315 }, '#rSmallStripe', true));
    this.shapes.push(new AnimateShape({ x: 500, y: 240 }, '#rSmallCircle', false));
    this.shapes.push(new AnimateShape({ x: 530, y: 150 }, '#rLeftRectangle', false));
  }

  updateShapes() {
    setTimeout(() => {
      const { data } = this.state;
      if (data.percentage % 20 > 17 && data.percentage % 20 !== 0) {
        this.setState({
          headingClass: styles.goToTop,
        });
        this.shapes.forEach((shape) => {
          shape.startMovement(data.percentage);
        });
      }
    }, 10);
  }

  componentDidUpdate(nextProps, nextState) {
    this.updateShapes(nextState.data);
  }

  componentWillUnmount() {
    this.container.removeEventListener('mousemove', this.seedGeneratorBoundToThis, true);
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
  isTouchDevice(agent) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent || navigator.userAgent || navigator.vendor || window.opera));
  }

  seedGenerator(nativeEvent) {
    let shouldTrigger;
    if (typeof nativeEvent === 'string') {
      shouldTrigger = true;
    } else {
      const distance =
        Math.sqrt(((nativeEvent.pageX - this.state.lastCaptured.x) ** 2) +
        ((nativeEvent.pageY - this.state.lastCaptured.y) ** 2));
      shouldTrigger = distance > 120;
    }

    if (shouldTrigger && (!this.state.data || this.state.data.percentage < 100)) {
      this.setState({
        lastCaptured: {
          x: nativeEvent.pageX,
          y: nativeEvent.pageY,
        },
      });

      // defining diffSeed to use for animating HEX numbers
      // note: in the first iteration data is undefined
      const oldSeed = this.state.data ? this.state.data.seed : this.state.zeroSeed;
      const data = generateSeed(this.state.data);
      const seedDiff = oldSeed.map((item, index) =>
        ((item !== data.seed[index]) ? index : null))
        .filter(item => item !== null);
      this.setState({ data, seedDiff });
      // this.circle.startMovement(this.state.data.percentage);
    } else if (this.state.data && this.state.data.percentage >= 100 && !this.state.passphrase) {
      // also change the step here
      const phrase = generatePassphrase(this.state.data);
      const address = extractAddress(phrase);
      this.setState({
        passphrase: phrase,
        firstHeadingClass: styles.firstHeading,
        secondHeadingClass: styles.secondHeading,
        address,
      });
      // this.props.changeHandler('passphrase', phrase);
      // this.props.changeHandler('current', 'show');
      console.log(extractAddress(phrase));
      this.shapes[4].css('opacity', 0);
      this.shapes[8].css('opacity', 0);
      this.shapes[3].css('opacity', 0);
    }
  }

  render() {
    const isTouch = this.isTouchDevice(this.props.agent);
    const percentage = this.state.data ? this.state.data.percentage : 0;
    return (
      <div className={`${grid.row} ${grid['center-xs']} ${styles.wrapper}`} id="generatorContainer" >
        <div className={grid['col-xs-12']}>
          <img className={styles.circle} id="rCircle" src={shapes.circle} />
          <img className={styles.smallCircle} id="rSmallCircle" src={shapes.smallCircle} />
          <img className={styles.triangle} id="rTriangle" src={shapes.triangle} />
          <img className={styles.smallTriangle} id="rSmallTriangle" src={shapes.smallTriangle} />
          <img className={styles.circleOutline} id="rCircleOutline" src={shapes.circleOutline} />
          <img className={styles.stripe} id="rStripe" src={shapes.stripe} />
          <img className={styles.smallStripe} id="rSmallStripe" src={shapes.smallStripe} />
          <img className={styles.rightRectangle} id="rRightRectangle" src={shapes.rightRectangle} />
          <img className={styles.leftRectangle} id="rLeftRectangle" src={shapes.leftRectangle} />

          {isTouch ?
            <div>
              <p>Enter text below to generate random bytes</p>
              <Input onChange={this.seedGeneratorBoundToThis}
                className='touch-fallback' autoFocus={true} multiline={true} />
            </div> :
            <header>
              <h2 className={`${styles.generatorHeader} ${this.state.headingClass} ${this.state.firstHeadingClass}`}
                id="generatorHeader" >
                {this.props.t('Create your Lisk ID')}
                <br/>
                {this.props.t('by moving your mouse.')}
              </h2>
              <h2
                className={`${styles.generatorHeader} ${this.state.headingClass} ${this.state.secondHeadingClass}`}
                id="generatorHeader" >
                {this.props.t('Create your Lisk ID')}
              </h2>
            </header>
          }
          {this.state.address ?
            <div className={styles.addressContainer}>
              <h4 className={styles.address}>{this.state.address}</h4>
              <PrimaryButton theme={styles} label='Get passphrase' />
            </div>
            : ''}
        </div>
        <div className={grid['col-xs-12']}>
          <ProgressBar mode='determinate' theme={styles}
            value={percentage} />
        </div>
      </div>
    );
  }
}

export default PassphraseGenerator;
