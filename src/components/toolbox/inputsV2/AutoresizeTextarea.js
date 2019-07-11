import React from 'react';
import PropTypes from 'prop-types';
import TextareaV2 from './textareaV2';
import styles from './inputV2.css';
import { deepEquals } from '../../../utils/polyfills';

class AutoresizeTextarea extends React.Component {
  constructor() {
    super();

    this.setRef = this.setRef.bind(this);
  }

  setRef(node) {
    this.textRef = node;
  }

  componentDidMount() {
    this.height = parseInt(this.textRef.scrollHeight, 10);
    this.textRef.style.height = `${this.height}px`;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.textRef.style.height = `${this.height}px`;
      return true;
    } if (!deepEquals(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { offsetHeight, scrollHeight } = this.textRef;
    this.textRef.style.height = `${this.height}px`;
    /* istanbul ignore next */
    if (offsetHeight < scrollHeight && scrollHeight > this.height) {
      this.textRef.style.height = `${scrollHeight}px`;
    }
  }

  render() {
    const { value, className, ...props } = this.props;
    return (
      <TextareaV2
        className={`${styles.autoresize} ${className}`}
        setRef={this.setRef}
        value={value}
        {...props}
      />
    );
  }
}

AutoresizeTextarea.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
};

AutoresizeTextarea.defaultProps = {
  className: '',
  size: 'l',
};

export default AutoresizeTextarea;
