import React from 'react';
import PropTypes from 'prop-types';
import styles from './onboarding.css';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../buttons/button';

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
    const { slides, onClose } = this.props;
    const { currentSlide } = this.state;

    return slides.length ? (
      <div className={styles.onboarding}>
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
            {slides.map(({ className = '', ...slide }, index) => (
              <section key={`slides-${index}`}
                className={`${className} ${index === currentSlide ? styles.active : ''}`}>
                  <h1 className={styles.title}>{slide.title}</h1>
                {typeof slide.content === 'string' &&
                  <p>{slide.content}</p>}
              </section>
            ))}
          </div>
          <div>
            <PrimaryButtonV2
              name={'next'}
              onClick={this.handleButtonClick}
            >
              Next
            </PrimaryButtonV2>
            {currentSlide === 0 ? null :
              <TertiaryButtonV2
                name={'prev'}
                onClick={this.handleButtonClick}
              >Previous</TertiaryButtonV2>
            }
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
    illustration: PropTypes.string,
  })),
};

Onboarding.defaultProps = {
  slides: [],
};

export default Onboarding;
