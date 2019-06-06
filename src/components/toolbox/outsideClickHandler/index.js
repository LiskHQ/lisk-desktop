import React from 'react';
import PropTypes from 'prop-types';

class OutsideClickHandler extends React.Component {
  constructor() {
    super();

    this.setChildNodeRef = this.setChildNodeRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { disabled, useCapture: capture } = this.props;
    if (!disabled) this.addEventListeners({ capture });
  }

  shouldComponentUpdate(nextProps) {
    const { disabled: wasDisabled } = this.props;
    const { disabled, useCapture: capture } = nextProps;
    if (disabled && !wasDisabled) this.removeEventListeners();
    if (wasDisabled && !disabled) this.addEventListeners({ capture });
    return true;
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  handleClick({ target }) {
    const { disabled, onOutsideClick } = this.props;
    if (disabled || (this.childNode && this.childNode.contains(target))) return;
    onOutsideClick();
  }

  addEventListeners({ capture }) {
    document.addEventListener('click', this.handleClick, { capture });
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleClick);
  }

  setChildNodeRef(node) {
    this.childNode = node;
  }

  render() {
    const {
      useCapture, onOutsideClick, disabled,
      children, className, wrapper,
      ...props
    } = this.props;
    return (
      <wrapper.type
        ref={this.setChildNodeRef}
        className={className}
        {...props}
      >
        {children}
      </wrapper.type>
    );
  }
}

OutsideClickHandler.propTyypes = {
  children: PropTypes.node.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  useCapture: PropTypes.bool,
  wrapper: PropTypes.element,
};

OutsideClickHandler.defaultProps = {
  className: '',
  disabled: false,
  useCapture: true,
  wrapper: <div />,
};

export default OutsideClickHandler;
