import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './navigationButtons.css';

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstPageIndex: 0,
      currentPageIndex: 0,
      historyLength: 0,
      action: '',
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
  }

  componentDidMount() {
    this.setState({
      firstPageIndex: this.props.history.length,
      historyLength: this.props.history.length,
      currentPageIndex: this.props.history.length,
    });
  }

  // eslint-disable-next-line max-statements
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.history.length !== nextState.historyLength && nextState.action === '') {
      this.setState({
        ...nextState,
        historyLength: nextProps.history.length,
        currentPageIndex: nextProps.history.length,
        action: '',
      });
      return false;
    }

    if (nextState.action === 'back' && nextState.currentPageIndex > nextState.firstPageIndex) {
      this.setState({
        ...nextState,
        currentPageIndex: nextState.currentPageIndex - 1,
        action: '',
      });
      this.props.history.goBack();
      return false;
    }

    if (nextState.action === 'forward' && nextState.currentPageIndex < nextProps.history.length) {
      this.setState({
        ...nextState,
        currentPageIndex: nextState.currentPageIndex + 1,
        action: '',
      });
      this.props.history.goForward();
      return false;
    }

    return true;
  }

  onGoBack(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      action: 'back',
    });
  }

  onGoForward(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      action: 'forward',
    });
  }

  render() {
    const { firstPageIndex, currentPageIndex, historyLength } = this.state;
    const isBackActive = firstPageIndex < currentPageIndex;
    const isForwardActive = firstPageIndex <= currentPageIndex && currentPageIndex < historyLength;

    return (
      <div className={styles.wrapper}>
        <button
          disabled={!isBackActive}
          onClick={this.onGoBack}
        >
          <img src={isBackActive ? svg.back_arrow_active_icon : svg.back_arrow_inactive_icon}/>
        </button>
        <button
          disabled={!isForwardActive}
          onClick={this.onGoForward}
        >
          <img src={isForwardActive
            ? svg.foward_arrow_active_icon : svg.foward_arrow_inactive_icon}/>
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
