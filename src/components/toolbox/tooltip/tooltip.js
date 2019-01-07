import React from 'react';
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
    const timeoutObj = !this.state.clicked && setTimeout(this.handleClose, 1000);

    this.setState({
      timeoutObj,
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
    const { title, children, footer } = this.props;
    return (
      <div
        className={`${styles.tooltipWrapper}`}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        ref={this.setWrapperRef}>
        <span
          className={styles.infoIcon}
          onClick={this.handleClick}
          />
        <div className={`${styles.tooltip}
          ${this.state.showTooltip && styles.shownTooltip}`}>
          <span className={`${styles.tooltipArrow}`}>
            <svg fill="currentColor" viewBox="0 0 8 36"><path d="M8 0C7 11 0 13 0 18s7 9 8 18z"/></svg>
          </span>
          <header>
            <p className={`${styles.title}`}>{title}</p>
          </header>
          <main>
            { children }
          </main>
          <footer>
            { footer }
          </footer>
        </div>
      </div>
    );
  }
}

export default Tooltip;
