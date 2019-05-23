import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styles from './onboarding.css';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../buttons/button';
import Illustration from '../illustration';

class Onboarding extends React.Component {
  constructor() {
    super();

    this.state = {
      currentSlide: 0,
    };

    this.setCurrent = this.setCurrent.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFinalCallback = this.handleFinalCallback.bind(this);
  }

  handleClose() {
    const { name } = this.props;
    localStorage.setItem(name, true);
    this.forceUpdate();
  }

  handleFinalCallback() {
    this.props.finalCallback();
    this.handleClose();
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
    const {
      slides, ctaLabel, className, t, name,
    } = this.props;
    const { currentSlide } = this.state;
    const closedBefore = !!localStorage.getItem(name);

    return slides.length && !closedBefore ? (
      <div className={`${styles.onboarding} ${className}`}>
        <span className={styles.closeBtn} onClick={this.handleClose} />
        <div className={styles.illustrations}>
          {slides.map(({ illustration }, i) =>
            <Illustration
              className={`${i === currentSlide ? styles.active : ''}`}
              key={`illustration-${i}`}
              name={illustration} />)
          }
        </div>

        <div className={styles.content}>
          {slides.length > 1 ?
            <span className={styles.bullets}>
              {slides.map((_, i) =>
                <span key={`bullet-${i}`}
                  data-index={i}
                  className={i === currentSlide ? styles.active : ''}/>)
              }
            </span> : null
          }
          <div className={styles.slides}>
            {slides.map((slide, index) => (
              <section key={`slides-${index}`}
                className={`${slide.className || ''} ${index === currentSlide ? styles.active : ''}`}>
                  <h1 className={styles.title}>{slide.title}</h1>
                  <p>{slide.content}</p>
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
                  {t('Previous')}
                </SecondaryButtonV2>
              ) : null
            }
            {(currentSlide !== slides.length - 1 && ctaLabel !== '')
              ? (<PrimaryButtonV2
                  name={'next'}
                  onClick={this.handleButtonClick}
                >
                  {t('Next')}
                </PrimaryButtonV2>
              ) : (
                <PrimaryButtonV2 onClick={this.handleFinalCallback}>
                  {ctaLabel}
                </PrimaryButtonV2>
            )}
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
  })),
  ctaLabel: PropTypes.string,
  finalCallback: PropTypes.func.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Onboarding.defaultProps = {
  slides: [],
  className: '',
  ctaLabel: '',
};

export default translate()(Onboarding);
