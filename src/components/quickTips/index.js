import React from 'react';
import Box from '../box';
import quickTips from '../../constants/quickTips';

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
    const currentSlide = quickTips[currentIndex];
    return (
      <Box className={`${styles.quickTips}`}>
        <div className={styles.title}>{currentSlide.title}</div>
        <div>{currentSlide.description}</div>
        <div className={styles.footer}>
          <a href={currentSlide.goTo.link}>{currentSlide.goTo.title}</a>
          <div>
            <div
              onClick={() => { this.previousStep(); }}
              disabled={currentIndex === 0}>Previous</div>
              {`${currentIndex + 1}/${quickTips.length + 1}`}
            <div
              onClick={() => { this.nextStep(); }}
              disabled={currentIndex === quickTips.length}>Next</div>
          </div>
        </div>
      </Box>);
  }
}
export default QuickTips;

