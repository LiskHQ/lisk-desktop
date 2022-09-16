import React from 'react';
import { withRouter } from 'react-router';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './Heading.css';

const Heading = ({ title, onGoBack, history, noBackButton, className }) => (
  <div className={`${styles.wrapper} ${className}`}>
    {!noBackButton && (
      <TertiaryButton onClick={onGoBack || history.goBack}>
        <Icon name="arrowLeftTailed" />
      </TertiaryButton>
    )}
    {title}
  </div>
);

export default withRouter(Heading);
