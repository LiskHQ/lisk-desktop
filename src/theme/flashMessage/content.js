import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/theme/Icon';
import styles from './flashMessage.css';

const Content = ({ children, icon, className, link }) => {
  const generateLinkProps = (action) =>
    typeof action === 'string'
      ? {
          href: link.action,
          rel: 'noopener noreferrer',
          target: '_blank',
        }
      : { onClick: link.action };

  return (
    <span className={`${styles.content} ${className} display-text`}>
      {!!icon && <Icon name={icon} className="icon" />}
      {children}
      {!!(link.label && link.action) && (
        <a
          className={`${styles.link} ${link.className || ''} url-link`}
          {...generateLinkProps(link.action)}
        >
          {link.label}
        </a>
      )}
    </span>
  );
};

Content.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]).isRequired,
  icon: PropTypes.string,
  className: PropTypes.string,
  link: PropTypes.shape({
    label: PropTypes.string,
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
  }),
};

Content.defaultProps = {
  icon: '',
  className: '',
  link: {
    label: '',
    action: '',
    className: '',
  },
};

Content.displayName = 'FlashMessage.Content';

export default Content;
