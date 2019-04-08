import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './navigationButtons.css';

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstPageIndex: 0,
      userLogout: false,
      counter: 0,
    };

    this.onNavigationClick = this.onNavigationClick.bind(this);
    this.resetNavigationValues = this.resetNavigationValues.bind(this);
    this.updateCounter = this.updateCounter.bind(this);
  }

  componentDidMount() {
    this.setState({
      firstPageIndex: this.props.history.length,
      counter: this.props.history.length,
    });
  }

  resetNavigationValues() {
    this.setState({
      firstPageIndex: this.props.history.length,
      counter: this.props.history.length,
      userLogout: true,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!!nextProps.account.afterLogout !== nextState.userLogout) {
      this.resetNavigationValues();
      return false;
    }

    if (this.props.history.action === 'PUSH') {
      this.props.history.action = '';
      this.setState({
        counter: this.state.counter + 1,
      });
      return false;
    }

    return true;
  }

  updateCounter(action) {
    if (action === 'back') {
      this.setState({ counter: this.state.counter - 1 });
      this.props.history.goBack();
    } else {
      this.setState({ counter: this.state.counter + 1 });
      this.props.history.goForward();
    }
  }

  onNavigationClick(e, action) {
    e.preventDefault();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.updateCounter(action), 300);
  }

  render() {
    const { counter, firstPageIndex } = this.state;
    const isBackActive = counter > firstPageIndex;
    const isForwardActive = counter < this.props.history.length;
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
          onClick={e => this.onNavigationClick(e, 'back')}
        >
          <img src={backArrow}/>
        </button>
        <button
          className={'go-forward'}
          disabled={!isForwardActive}
          onClick={e => this.onNavigationClick(e, 'forward')}
        >
          <img src={forwardArrow}/>
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
