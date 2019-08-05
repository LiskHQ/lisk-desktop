import React from 'react';
import PropTypes from 'prop-types';
import Content from './content';
import Button from './button';
import styles from './flashMessage.css';

class FlashMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      dismissed: false,
    };

    this.dismiss = this.dismiss.bind(this);
  }

  dismiss() {
    const { onDismiss } = this.props;
    this.setState({ dismissed: true });
    if (typeof onDismiss === 'function') onDismiss();
  }

  render() {
    const { className, shouldShow, children } = this.props;
    const { dismissed } = this.state;
    return shouldShow && !dismissed && (
      <div className={`${styles.wrapper} ${className}`}>
        {children}
        {
          !(Array.isArray(children) && children.some(child => child.type === Button)) && (
            <span
              className={styles.closeBtn}
              onClick={this.dismiss}
            />
          )
        }
      </div>
    );
  }
}

FlashMessage.propTypes = {
  className: PropTypes.string,
  shouldShow: PropTypes.bool,
  onDismiss: PropTypes.func,
};

FlashMessage.defaultProps = {
  className: '',
  shouldShow: false,
  onDismiss: null,
};

FlashMessage.displayName = 'FlashMessage';
FlashMessage.Content = Content;
FlashMessage.Button = Button;

export default FlashMessage;
