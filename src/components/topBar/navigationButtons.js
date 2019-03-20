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
      userLogout: false,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
    this.resetNavigationValues = this.resetNavigationValues.bind(this);
  }

  componentDidMount() {
    this.setState({
      firstPageIndex: this.props.history.length,
      historyLength: this.props.history.length,
      currentPageIndex: this.props.history.length,
    });
  }

  resetNavigationValues() {
    this.setState({
      firstPageIndex: this.props.history.length,
      historyLength: this.props.history.length,
      currentPageIndex: this.props.history.length,
      userLogout: true,
    });
  }

  // eslint-disable-next-line max-statements
  shouldComponentUpdate(nextProps, nextState) {
    if (!!nextProps.account.afterLogout !== nextState.userLogout) {
      this.resetNavigationValues();
      return false;
    }

    if (nextProps.history.length !== nextState.historyLength && nextState.action === '') {
      this.setState({
        historyLength: nextProps.history.length,
        currentPageIndex: nextProps.history.length,
        action: '',
      });
      return false;
    }

    if (nextState.action === 'back' && nextState.currentPageIndex > nextState.firstPageIndex) {
      this.setState({
        currentPageIndex: nextState.currentPageIndex - 1,
        action: '',
      });
      this.props.history.goBack();
      return false;
    }

    if (nextState.action === 'forward' && nextState.currentPageIndex < nextProps.history.length) {
      this.setState({
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

    this.setState({ action: 'back' });
  }

  onGoForward(e) {
    e.preventDefault();

    this.setState({ action: 'forward' });
  }

  render() {
    const { firstPageIndex, currentPageIndex, historyLength } = this.state;
    const isBackActive = firstPageIndex < currentPageIndex;
    const isForwardActive = firstPageIndex <= currentPageIndex && currentPageIndex < historyLength;
    const backArrow = isBackActive
      ? svg.back_arrow_active_icon
      : svg.back_arrow_inactive_icon;
    const forwardArrow = isForwardActive
      ? svg.foward_arrow_active_icon
      : svg.foward_arrow_inactive_icon;

    return (
      <div className={`${styles.wrapper} navigation-buttons`}>
        <button
          className={'go-back'}
          disabled={!isBackActive}
          onClick={this.onGoBack}
        >
          <img src={backArrow}/>
        </button>
        <button
          className={'go-forward'}
          disabled={!isForwardActive}
          onClick={this.onGoForward}
        >
          <img src={forwardArrow}/>
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
