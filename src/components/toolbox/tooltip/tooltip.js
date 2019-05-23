import React from 'react';
import PropTypes from 'prop-types';
import styles from './tooltip.css';

class Tooltip extends React.Component {
  constructor() {
    super();

    this.state = {
      showTooltip: false,
      timeoutObj: null,
      clicked: false,
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutObj);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleMouseMove() {
    if (this.state.timeoutObj) {
      clearTimeout(this.state.timeoutObj);
    }
    this.setState({
      timeoutObj: null,
      showTooltip: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      timeoutObj: !this.state.clicked && this.state.showTooltip
        && setTimeout(this.handleClose, 1000),
    });
  }

  handleClick() {
    document.addEventListener('click', this.handleClose);
    this.setState({
      clicked: true,
      showTooltip: true,
    });
  }

  handleClose(event) {
    if (this.wrapperRef && (event && !this.wrapperRef.contains(event.target))) {
      document.removeEventListener('click', this.handleClose);
    }
    this.setState({
      clicked: false,
      showTooltip: false,
    });
  }

  render() {
    const {
      title, children, footer, className, alwaysShow, content,
    } = this.props;
    const {
      showTooltip,
    } = this.state;
    const {
      infoIcon = '', tooltip = '',
    } = this.props.styles || {};
    return React.isValidElement(children) && (
      <div
        className={`${styles.tooltipWrapper} ${className}`}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        ref={this.setWrapperRef}>
        {React.isValidElement(content) ?
          content :
          <span
            className={`${styles.infoIcon} ${infoIcon}`}
            onClick={this.handleClick} >
          </span>
         }
        <div className={`${styles.tooltip} ${(alwaysShow || showTooltip) ? 'shownTooltip' : ''} ${tooltip} tooltip-window`}>
          <span className={`${styles.tooltipArrow} tooltip-arrow`}>
            <svg stroke="inherit" fill="currentColor" viewBox="0 0 14 28">
              <path d="M13.307.5S.5 10.488.5 13.896c0 3.409 12.785 12.893 12.785 12.893"/>
            </svg>
          </span>
          {title !== '' && (
            <header>
              <p className={`${styles.title}`}>{title}</p>
            </header>
          )}
          <main>{children}</main>
          {React.isValidElement(footer) &&
            <footer>{footer}</footer>}
        </div>
      </div>
    );
  }
}

Tooltip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.node,
};

Tooltip.defaultProps = {
  title: '',
  children: <React.Fragment />,
  className: '',
};

export default Tooltip;
