import React from 'react';
import { translate } from 'react-i18next';
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
    const currentSlide = quickTips(this.props.t)[currentIndex];

    return (
      <Box className={`quickTips ${styles.quickTips}`}>
        <div className={styles.title}>{
          currentSlide.title
        }</div>
        <div className={styles.quickTipBody}>
          <div className={`${styles.descriptionRow}`}>
            <div className={`${styles.description}`}>
              {currentSlide.description.map((desc, key) =>
                <span key={`desc-${key}`}>{desc}<br/><br/></span>)}
            </div>
            <div className={`${styles.picture}`}><img src={currentSlide.picture} /></div>
          </div>
          <div className={styles.footer}>
            <a href={currentSlide.goTo.link} className={styles.goTo}>
              {currentSlide.goTo.title}<FontIcon value='arrow-right'/>
            </a>
            <div className={styles.steps}>
              <div
                onClick={() => { this.previousStep(); }}
                className={`${styles.previousStep} ${currentIndex === 0 ? styles.disabled : ''}`}
              ><FontIcon className={styles.arrow} value='arrow-left'/>{this.props.t('Previous')}</div>
                {`${currentIndex + 1}  /  ${quickTips(this.props.t).length}`}
              <div
                onClick={() => { this.nextStep(); }}
                className={`${styles.nextStep} ${currentIndex + 1 === quickTips(this.props.t).length ? styles.disabled : ''}`}
              >{this.props.t('Next')}<FontIcon className={styles.arrow} value='arrow-right'/></div>
            </div>
          </div>
        </div>
      </Box>);
  }
}
export default translate()(QuickTips);

