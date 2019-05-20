import React from 'react';
import PropTypes from 'prop-types';
import styles from './onboarding.css';

class Onboarding extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 0,
    };
  }

  render() {
    const { slides } = this.props;
    const { step } = this.state;

    return slides.length ? (
      <div className={styles.onboarding}>
        <span className={styles.closeBtn} />
        {slides.map(({ className = '', ...slide }, index) => (
          <section key={`slides-${index}`}
            style={{ backgroundImage: `url(${slide.illustration})` }}
            className={`${className} ${index === step ? 'active' : ''}`}>
            <h1 className={styles.title}>{slide.title}</h1>
            {typeof slide.content === 'string' &&
              <p className={styles.content}>{slide.content}</p>}
          </section>
        ))}
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
