import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Input } from 'react-toolbox/lib/input';
import { generateSeed, generatePassphrase } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/api/account';
import AccountVisual from '../../accountVisual';
import styles from './create.css';
import ProgressBar from '../../toolbox/progressBar/progressBar';
import * as shapesSrc from '../../../assets/images/register-shapes/*.svg'; //eslint-disable-line
import MovableShape from './movableShape';
import { PrimaryButton } from '../../toolbox/buttons/button';

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
      shapes: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      firstHeadingClass: '',
      secondHeadingClass: '',
      headingClass: '',
    };
    this.seedGeneratorBoundToThis = this.seedGenerator.bind(this);
  }

  componentDidMount() {
    this.container = document.getElementById('generatorContainer');
    if (!this.isTouchDevice(this.props.agent)) {
      document.addEventListener('mousemove', this.seedGeneratorBoundToThis, true);
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
    this.moveTitle();
  }

  componentWillUnmount() {
    if (!this.isTouchDevice(this.props.agent)) {
      document.removeEventListener('mousemove', this.seedGeneratorBoundToThis, true);
    }
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
      const data = generateSeed(this.state.data);
      this.setState({ data });
    } else if (this.state.data && this.state.data.percentage >= 100 && !this.state.passphrase) {
      // also change the step here
      const phrase = generatePassphrase(this.state.data);
      const address = extractAddress(phrase);
      this.setState({
        passphrase: phrase,
        firstHeadingClass: styles.firstHeadingAnimation,
        secondHeadingClass: styles.secondHeadingAnimation,
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
    const isTouch = this.isTouchDevice(this.props.agent);
    const { t, nextStep } = this.props;
    const { shapes } = this.state;
    const percentage = this.state.data ? this.state.data.percentage : 0;
    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} id="generatorContainer" >
        <div className={grid['col-xs-12']}>
          {!this.state.address ?
            <div>
              <MovableShape
                hidden={shapes[0]}
                src={shapesSrc.circle}
                className={styles.circle}
                percentage={percentage}
                reverse={true}
                end={{ x: 550, y: 50 }}/>
              <MovableShape
                hidden={shapes[1]}
                src={shapesSrc.smallCircle}
                className={styles.smallCircle}
                percentage={percentage}
                reverse={false}
                end={{ x: 500, y: 240 }}/>
              <MovableShape
                hidden={shapes[2]}
                src={shapesSrc.triangle}
                className={styles.triangle}
                percentage={percentage}
                reverse={true}
                end={{ x: 450, y: 230 }}/>
              <MovableShape
                hidden={shapes[3]}
                src={shapesSrc.smallTriangle}
                className={styles.smallTriangle}
                percentage={percentage}
                reverse={true}
                end={{ x: 450, y: 180 }}/>
              <MovableShape
                hidden={shapes[5]}
                src={shapesSrc.circleOutline}
                className={styles.circleOutline}
                percentage={percentage}
                reverse={false}
                end={{ x: 250, y: 350 }}/>
              <MovableShape
                hidden={shapes[6]}
                src={shapesSrc.stripe}
                className={styles.stripe}
                percentage={percentage}
                reverse={false}
                end={{ x: 100, y: 200 }}/>
              <MovableShape
                hidden={shapes[7]}
                src={shapesSrc.smallStripe}
                className={styles.smallStripe}
                percentage={percentage}
                reverse={true}
                end={{ x: 280, y: 315 }}/>
              <MovableShape
                hidden={shapes[4]}
                src={shapesSrc.rightRectangle}
                className={styles.rightRectangle}
                percentage={percentage}
                reverse={true}
                end={{ x: 300, y: 220 }}/>
              <MovableShape
                hidden={shapes[8]}
                src={shapesSrc.leftRectangle}
                className={styles.leftRectangle}
                percentage={percentage}
                reverse={false}
                end={{ x: 530, y: 150 }}/>
            </div> :
            null
          }
          <header>
            {isTouch ?
              <div>
                <p>{t('Enter text below to generate random bytes')}</p>
                <Input onChange={this.seedGeneratorBoundToThis}
                  className='touch-fallback' autoFocus={true} multiline={true} />
              </div> :
              <h2 className={`${styles.generatorHeader} ${this.state.headingClass} ${this.state.firstHeadingClass}`}
                id="generatorHeader" >
                {this.props.t('Create your Lisk ID')}
                <br/>
                {this.props.t('by moving your mouse.')}
              </h2>
            }
            <h2 className={`${styles.secondHeading} ${this.state.headingClass} ${this.state.secondHeadingClass}`}>
              {t('Create your Lisk ID')}
              <small>{t('This is your Lisk-ID consisting of an address and avatar.')}</small>
            </h2>
          </header>
          {this.state.address ?
            <div className={styles.addressContainer}>
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
            </div>
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
