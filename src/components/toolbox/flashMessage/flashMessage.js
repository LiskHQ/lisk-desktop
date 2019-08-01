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
    this.setState({ dismissed: true });
  }

  render() {
    const { className, shouldShow, children } = this.props;
    const { dismissed } = this.state;
    return (
      <div className={`${styles.wrapper} ${shouldShow && !dismissed ? styles.show : ''} ${className}`}>
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
};

FlashMessage.defaultProps = {
  className: '',
  shouldShow: false,
};

FlashMessage.displayName = 'FlashMessage';
FlashMessage.Content = Content;
FlashMessage.Button = Button;

export default FlashMessage;
