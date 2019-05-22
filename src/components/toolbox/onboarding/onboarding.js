import React from 'react';
import PropTypes from 'prop-types';
import styles from './onboarding.css';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../buttons/button';

class Onboarding extends React.Component {
  constructor() {
    super();

    this.state = {
      currentSlide: 0,
    };

    this.setCurrent = this.setCurrent.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick({ target: { name } }) {
    const { currentSlide } = this.state;
    return name === 'next'
      ? this.setCurrent(currentSlide + 1)
      : this.setCurrent(currentSlide - 1);
  }

  setCurrent(index) {
    const { slides: { length } } = this.props;
    const currentSlide = index >= 0 && index < length
      ? index : this.state.currentSlide;
    this.setState({
      currentSlide,
    });
  }

  render() {
    const { slides, onClose, className } = this.props;
    const { currentSlide } = this.state;

    return slides.length ? (
      <div className={`${styles.onboarding} ${className}`}>
        <span className={styles.closeBtn} onClick={onClose} />
        <div className={styles.illustrations}>
          {slides.map(({ illustration }, i) =>
            <img
              className={`${i === currentSlide ? styles.active : ''}`}
              key={`illustration-${i}`}
              src={illustration} />)
          }
        </div>

        <div className={styles.content}>
          <span className={styles.bullets}>
            {slides.map((_, i) =>
              <span key={`bullet-${i}`}
                data-index={i}
                className={i === currentSlide ? styles.active : ''}/>)
            }
          </span>
          <div className={styles.slides}>
            {slides.map((slide, index) => (
              <section key={`slides-${index}`}
                className={`${slide.className || ''} ${index === currentSlide ? styles.active : ''}`}>
                  <h1 className={styles.title}>{slide.title}</h1>
                {typeof slide.content === 'string' &&
                  <p>{slide.content}</p>}
              </section>
            ))}
          </div>
          <div className={styles.buttonsHolder}>
            {currentSlide !== 0
              ? (
                <SecondaryButtonV2
                  className={'light'}
                  name={'prev'}
                  onClick={this.handleButtonClick}
                >
                  Previous
                </SecondaryButtonV2>
              ) : null
            }
            <PrimaryButtonV2
              name={'next'}
              onClick={this.handleButtonClick}
            >
              Next
            </PrimaryButtonV2>
          </div>
        </div>
      </div>
    ) : null;
  }
}

Onboarding.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    illustration: PropTypes.string.isRequired,
  })).isRequired,
  ctaLabel: PropTypes.string.isRequired,
  finalCallback: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Onboarding.defaultProps = {
  slides: [],
  className: '',
};

export default Onboarding;
