import React from 'react';
import { translate } from 'react-i18next';
import Box from '../box';
import quickTips from '../../constants/quickTips';
import { FontIcon } from '../fontIcon';
import TransitionWrapper from '../toolbox/transitionWrapper';

import styles from './index.css';

class QuickTips extends React.Component {
  constructor() {
    super();
    this.state = {
      currentIndex: 0,
    };
  }

  nextStep() {
    const { currentIndex } = this.state;
    const nextIndex = currentIndex + 1;

    this.setState({ currentIndex: nextIndex });
  }

  previousStep() {
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
            <div className={styles.title}>{currentSlide.title}</div>
          </TransitionWrapper>)
        }
        <div className={styles.quickTipBody}>
          {slides.map(slide =>
            <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-body-${slide.title}`}>
              <div className={`${styles.descriptionRow}`}>
                <div className={`${styles.description}`}>
                  {currentSlide.description.map((desc, key) =>
                    <span key={`desc-${key}`}>{desc}<br/><br/></span>)}
                </div>
                <div className={`${styles.picture}`}><img src={currentSlide.picture} /></div>
              </div>
            </TransitionWrapper>)
          }
          <div className={styles.footer}>
            {slides.map(slide =>
              <TransitionWrapper current={currentSlide.title} step={slide.title} key={`transition-goto-${slide.title}`}>
                <a href={currentSlide.goTo.link} className={styles.goTo}>
                  {currentSlide.goTo.title}<FontIcon value='arrow-right'/>
                </a>
              </TransitionWrapper>)
            }
            <div className={styles.steps}>
              <div
                onClick={() => { this.previousStep(); }}
                className={`previousStep ${styles.previousStep}
                  ${currentIndex === 0 ? `${styles.disabled} disabled` : ''}`}
              ><FontIcon className={styles.arrow} value='arrow-left'/>{this.props.t('Previous')}</div>
                <div className="pagination">{`${currentIndex + 1}  /  ${quickTips(this.props.t).length}`}</div>
              <div
                onClick={() => { this.nextStep(); }}
                className={`nextStep ${styles.nextStep}
                  ${currentIndex + 1 === quickTips(this.props.t).length ? `${styles.disabled} disabled` : ''}`}
              >{this.props.t('Next')}<FontIcon className={styles.arrow} value='arrow-right'/></div>
            </div>
          </div>
        </div>
      </Box>);
  }
}
export default translate()(QuickTips);

