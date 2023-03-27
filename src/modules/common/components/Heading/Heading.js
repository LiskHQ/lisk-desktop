import React from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './Heading.css';

const Heading = ({ title, onGoBack, history, noBackButton, className, children }) => (
  <div className={`${styles.wrapper} ${className}`}>
    {!noBackButton && (
      <TertiaryButton onClick={onGoBack || history.goBack}>
        <Icon name="arrowLeftTailed" />
      </TertiaryButton>
    )}
    {title}
    <div className={styles.rightSection}>{children}</div>
  </div>
);

export default Heading;
