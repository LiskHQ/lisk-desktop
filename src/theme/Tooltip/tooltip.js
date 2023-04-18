import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/theme/Icon';
import useOutsideClickListener from 'src/utils/useOutsideClickListener';
import styles from './tooltip.css';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: props.showTooltip,
      timeoutObj: null,
      clicked: false,
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.wrapperRef = React.createRef();
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleMouseMove() {
    this.setState({
      timeoutObj: null,
      showTooltip: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      timeoutObj: !this.state.clicked && this.state.showTooltip,
    });
    this.handleClose();
  }

  handleClick() {
    document.addEventListener('click', this.handleClose);
    this.setState({
      clicked: true,
      showTooltip: true,
    });
  }

  handleClose(event) {
    if (this.wrapperRef && event && !this.wrapperRef.contains(event.target)) {
      document.removeEventListener('click', this.handleClose);
    }
    this.setState({
      clicked: false,
      showTooltip: false,
    });
  }

  render() {
    const {
      title,
      children,
      footer,
      className,
      position = 'bottom',
      alwaysShow,
      content,
      tooltipClassName,
      size,
      indent,
      noArrow,
      isHidden,
    } = this.props;
    const { showTooltip } = this.state;
    const { infoIcon = '', tooltip = '' } = this.props.styles || {};
    const positionStyles = position
      .split(' ')
      .filter((key) => ['top', 'bottom', 'left', 'right'].indexOf(key) >= 0)
      .map((key) => styles[key])
      .join(' ');

    return (
      <TooltipContent
        tooltipRef={this.wrapperRef }
        className={className}
        handleMouseLeave={this.handleMouseLeave}
        handleMouseMove={this.handleMouseMove}
        content={content}
        infoIcon={infoIcon}
        handleClick={this.handleClick}
        positionStyles={positionStyles}
        alwaysShow={alwaysShow}
        showTooltip={showTooltip}
        tooltip={tooltip}
        indent={indent}
        size={size}
        noArrow={noArrow}
        tooltipClassName={tooltipClassName}
        title={title}
        footer={footer}
        isHidden={isHidden}
      >
        {children}
      </TooltipContent>
    );
  }
}

Tooltip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.node,
  showTooltip: PropTypes.bool,
  size: PropTypes.oneOf(['s', 'm', 'l', 'maxContent']),
};

Tooltip.defaultProps = {
  title: '',
  children: <></>,
  className: '',
  size: 'l',
  showTooltip: false,
};

export default Tooltip;

function TooltipContent({
  tooltipRef,
  children,
  className,
  handleMouseLeave,
  handleMouseMove,
  content,
  infoIcon,
  handleClick,
  positionStyles,
  alwaysShow,
  showTooltip,
  tooltip,
  indent,
  size,
  noArrow,
  tooltipClassName,
  title,
  footer,
  isHidden,
}) {
  useOutsideClickListener(tooltipRef, showTooltip, handleMouseLeave);

  return (
    React.isValidElement(children) && (
      <div
        className={[styles.tooltipWrapper, className].join(' ')}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        ref={tooltipRef}
      >
        {React.isValidElement(content) ? (
          content
        ) : (
          <Icon
            name="tooltipQuestionMark"
            className={`${styles.infoIcon} ${infoIcon}`}
            onClick={handleClick}
          />
        )}
        <div
          className={[
            styles.tooltip,
            positionStyles,
            (alwaysShow || showTooltip) && !isHidden && styles.visible,
            tooltip,
            indent && styles.indent,
            'tooltip-window',
            styles[size],
            tooltipClassName,
          ].join(' ')}
        >
          {!noArrow && (
            <span className={`${styles.tooltipArrow} tooltip-arrow`}>
              <svg stroke="inherit" fill="currentColor" viewBox="0 0 14 28">
                <path d="M13.307.5S.5 10.488.5 13.896c0 3.409 12.785 12.893 12.785 12.893" />
              </svg>
            </span>
          )}
          {title !== '' && (
            <header>
              <p className={`${styles.title}`}>{title}</p>
            </header>
          )}
          <main>{children}</main>
          {React.isValidElement(footer) && <footer>{footer}</footer>}
        </div>
      </div>
    )
  );
}
