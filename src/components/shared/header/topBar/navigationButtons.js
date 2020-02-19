import React from 'react';
import styles from './navigationButtons.css';
import Icon from '../../../toolbox/icon';

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstPageIndex: 0,
      userLogout: false,
      counter: 0,
      mounted: false,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
    this.resetNavigationValues = this.resetNavigationValues.bind(this);
  }

  componentDidMount() {
    this.setState({
      firstPageIndex: this.props.history.length,
      counter: this.props.history.length,
      mounted: true,
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

    if (this.props.history.action === 'PUSH' && this.state.mounted) {
      this.props.history.action = '';
      this.setState({
        counter: this.state.counter + 1,
      });
      return false;
    }

    return true;
  }

  onGoBack(e) {
    e.preventDefault();
    this.setState(({ counter }) => ({ counter: counter - 1 }));
    this.props.history.goBack();
  }

  onGoForward(e) {
    e.preventDefault();
    this.setState(({ counter }) => ({ counter: counter + 1 }));
    this.props.history.goForward();
  }

  render() {
    const { counter, firstPageIndex } = this.state;
    const isBackActive = counter > firstPageIndex;
    const isForwardActive = counter < this.props.history.length;

    return (
      <div className={`${styles.wrapper} navigation-buttons`}>
        <button
          className="go-back"
          disabled={!isBackActive}
          onClick={this.onGoBack}
        >
          <Icon name="arrowLeftActive" />
        </button>
        <button
          className="go-forward"
          disabled={!isForwardActive}
          onClick={this.onGoForward}
        >
          <Icon name="arrowRightActive" />
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
