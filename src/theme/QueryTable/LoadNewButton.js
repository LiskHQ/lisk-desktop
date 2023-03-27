import React from 'react';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './styles.css';

export const LoadNewButton = ({ handleClick, buttonClassName, children }) => (
  <PrimaryButton
    onClick={handleClick}
    className={`${styles.button} ${buttonClassName || ''} load-latest`}
  >
    <Icon name="refreshActive" className={styles.icon} />
    <span>{children}</span>
  </PrimaryButton>
);
