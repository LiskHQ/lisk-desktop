import React from 'react';
import { translate } from 'react-i18next';
import Box from '../box';
import quickTips from '../../constants/quickTips';
import { FontIcon } from '../fontIcon';
import TransitionWrapper from '../toolbox/transitionWrapper';
import Piwik from '../../utils/piwik';
import styles from './index.css';

class QuickTips extends React.Component {
  constructor() {
    super();
    this.state = {
      currentIndex: 0,
    };
  }

  nextStep() {
    Piwik.trackingEvent('QuickTips', 'button', 'Next step');
    const { currentIndex } = this.state;
    const nextIndex = currentIndex + 1;

    this.setState({ currentIndex: nextIndex });
  }

  previousStep() {
    Piwik.trackingEvent('QuickTips', 'button', 'Previous step');
    const { currentIndex } = this.state;
    const nextIndex = currentIndex - 1;

    this.setState({ currentIndex: nextIndex });
  }

  render() {
    const { currentIndex } = this.state;
    const slides = quickTips(this.props.t);
    const currentSlide = slides[currentIndex];

    return (
      <Box className={`quickTips ${styles.quickTips}`}>
        {slides.map(slide =>
          <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-title-${slide.title}`}>
            <div className={styles.picture}>
              <img src={slide.picture} />
            </div>
          </TransitionWrapper>)
        }
        {slides.map(slide =>
          <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-title-${slide.title}`}>
            <div className={styles.header}>
              <h2>{slide.title}</h2>
            </div>
          </TransitionWrapper>)
        }
        <div className={styles.quickTipBody}>
          {slides.map(slide =>
            <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-body-${slide.title}`}>
              <div className={`${styles.descriptionRow}`}>
                <div className={`${styles.description}`}>
                  {slide.description.map((desc, key) =>
                    <span key={`desc-${key}`}>{desc}<br/><br/></span>)}
                </div>
              </div>
            </TransitionWrapper>)
          }
          {slides.map(slide =>
            <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-goto-${slide.title}`}>
              <div className={styles.footer}>
                <a href={slide.goTo.link} className={styles.goTo} target='_blank' rel='noopener noreferrer'>
                  {slide.goTo.title}
                </a>

                <div className={styles.steps}>
                  <div
                    onClick={() => this.previousStep()}
                    className={`previousStep ${styles.previousStep} ${currentIndex === 0 ? `${styles.disabled} disabled` : ''}`}
                  >
                    <FontIcon className={styles.arrow} value='arrow-left'/>
                    {this.props.t('Previous')}
                  </div>
                  <div className="pagination">
                    {`${currentIndex + 1}  /  ${quickTips(this.props.t).length}`}
                  </div>
                  <div
                    onClick={() => this.nextStep()}
                    className={`nextStep ${styles.nextStep} ${currentIndex + 1 === quickTips(this.props.t).length ? `${styles.disabled} disabled` : ''}`}
                  >
                    {this.props.t('Next')}
                    <FontIcon className={styles.arrow} value='arrow-right'/>
                  </div>
                </div>
              </div>
            </TransitionWrapper>)
          }
        </div>
      </Box>);
  }
}
export default translate()(QuickTips);
