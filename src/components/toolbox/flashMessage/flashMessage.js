import React from 'react';
import Icon from '../icon';
import { SecondaryButtonV2 } from '../buttons/button';
import styles from './flashMessage.css';

const FlashMessage = ({
  buttonClassName,
  buttonText,
  className,
  displayText,
  iconName,
  linkCaption,
  linkClassName,
  linkUrl,
  onButtonClick,
}) => (
  <section className={`${styles.wrapper} ${className}`}>
    {
      iconName
        ? <Icon name={iconName} />
        : null
    }
    <span className={styles.text}>
      {displayText}
    </span>
    {
      linkUrl
        ? (
          <a
            className={`${styles.externalLink} ${linkClassName}`}
            href={linkUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkCaption}
          </a>
        )
        : null
    }
    {
      buttonText
        ? (
          <SecondaryButtonV2
            className={`${styles.button} ${buttonClassName}`}
            onClick={onButtonClick}
          >
            {buttonText}
          </SecondaryButtonV2>
        )
        : null
    }
  </section>
);

FlashMessage.defaultProps = {
  buttonClassName: 'liskChat',
  buttonText: '',
  className: '',
  displayText: '',
  iconName: '',
  linkCaption: '',
  linkClassName: '',
  linkUrl: '',
};

export default FlashMessage;
