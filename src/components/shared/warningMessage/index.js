/* eslint-disable max-lines */
import React from 'react';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import Icon from '@toolbox/icon';
import styles from './styles.css';

const PhraseRevoveryWarningMessage = ({ title, children }) => (
  <FlashMessage shouldShow hasCloseAction={false} className={styles.flashMessage}>
    <FlashMessage.Content>
      <div className={styles.warningContainer}>
        <div>
          <Icon name="warningYellow" />
        </div>
        <div>
          <p className={styles.title}>{title}</p>
          {children}
        </div>
      </div>
    </FlashMessage.Content>
  </FlashMessage>
);

export default PhraseRevoveryWarningMessage;
