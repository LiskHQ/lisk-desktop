import React from 'react';
import Box from '../box';
import quickTips from '../../constants/quickTips';
import { FontIcon } from '../fontIcon';

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
    if (currentIndex + 1 === quickTips.length) return;
    const nextIndex = currentIndex + 1;

    this.setState({ currentIndex: nextIndex });
  }

  previousStep() {
    const { currentIndex } = this.state;
    if (currentIndex === 0) return;
    const nextIndex = currentIndex - 1;

    this.setState({ currentIndex: nextIndex });
  }

  render() {
    const { currentIndex } = this.state;
    const currentSlide = quickTips[currentIndex];

    return (
      <Box className={`${styles.quickTips}`}>
        <div className={styles.title}>{currentSlide.title}</div>
        <div className={`${styles.descriptionRow}`}>
          <div>
            {currentSlide.description.map((desc, key) => <span key={`desc-${key}`}><br/><br/>{desc}</span>)}
          </div>
          <div><img src={currentSlide.picture} /></div>
        </div>
        <div className={styles.footer}>
          <a href={currentSlide.goTo.link}>
            {currentSlide.goTo.title}<FontIcon value='arrow-right'/>
          </a>
          <div className={styles.steps}>
            <div
              onClick={() => { this.previousStep(); }}
              styles={`${currentIndex === 0 ? styles.disabled : ''}`}
            ><FontIcon value='arrow-left'/>Previous</div>
              {`${currentIndex + 1}/${quickTips.length}`}
            <div
              onClick={() => { this.nextStep(); }}
              styles={`${currentIndex + 1 === quickTips.length ? styles.disabled : ''}`}
            >Next<FontIcon value='arrow-right'/></div>
          </div>
        </div>
      </Box>);
  }
}
export default QuickTips;

