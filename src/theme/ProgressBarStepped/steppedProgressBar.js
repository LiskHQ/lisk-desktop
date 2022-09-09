import React, { Fragment } from 'react';
import { useTheme } from 'src/theme/Theme';
import styles from './styles.css';

const Step = ({ children, current, active }) => (
  <span className={[styles.step, current || active ? styles.active : ''].filter(Boolean).join(' ')}>
    {children}
  </span>
);

const Divider = ({ index, active }) => (
  <span className={[styles.divider, active ? styles.solid : ''].filter(Boolean).join(' ')}>
    {index}
  </span>
);

const SteppedProgressBar = ({ total, current, className, labels }) => {
  const theme = useTheme();
  const steps = new Array(total).fill(null);

  const children = steps.map((_, index) => {
    const isActive = index < current - 1;
    const isCurrent = index === current - 1;
    const text = index + 1;

    if (index === total - 1) {
      return (
        <Step key={`step-${total - 1}`} active={isActive} current={isCurrent}>
          {text}
        </Step>
      );
    }

    return (
      <Fragment key={`step-${index}`}>
        <Step active={isActive} current={isCurrent}>
          {text}
        </Step>
        <Divider active={isActive} />
      </Fragment>
    );
  });

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.stepContainer}>{children}</div>
      <div className={styles.labelContainer}>
        {labels.map((label, index) => (
          <span
            className={`${index <= current - 1 ? styles.activeLabel : ''} ${styles[theme]}`}
            key={index}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SteppedProgressBar;
