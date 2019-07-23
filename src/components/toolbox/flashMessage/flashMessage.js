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
  <div className={`${styles.wrapper} ${className}`}>
    {
      iconName
        ? <Icon name={iconName} className="icon" />
        : null
    }
    <span className={`${styles.text} display-text`}>
      {displayText}
    </span>
    {
      linkUrl && linkCaption
        ? (
          <a
            className={`${styles.externalLink} ${linkClassName} url-link`}
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
            className={`${styles.button} ${buttonClassName} button`}
            onClick={onButtonClick}
          >
            {buttonText}
          </SecondaryButtonV2>
        )
        : null
    }
  </div>
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
