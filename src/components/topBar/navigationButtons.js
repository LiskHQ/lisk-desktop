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
      isUserLogedIn: false,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      firstPageIndex: this.props.history.length,
      historyLength: this.props.history.length,
    }));
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.history.length !== nextProps.history.length) {
      this.setState(prevState => ({
        ...prevState,
        currentPageIndex: prevState.currentPageIndex + 1,
      }));
      return false;
    }
    return true;
  }

  onGoBack(e) {
    e.preventDefault();
    const { firstPageIndex, currentPageIndex } = this.state;
    if (firstPageIndex < currentPageIndex) {
      this.setState(prevState => ({
        ...prevState,
        currentPageIndex: currentPageIndex - 1,
      }));
      this.props.history.goBack();
    }
  }

  onGoForward(e) {
    e.preventDefault();
    const { currentPageIndex } = this.state;
    this.setState(prevState => ({
      ...prevState,
      currentPageIndex: currentPageIndex + 1,
    }));
    this.props.history.goForward();
  }

  render() {
    const { account } = this.props;
    const isButtonDisabled = !(!!account.address && true);

    return (
      <div className={styles.wrapper}>
        <button
          disabled={isButtonDisabled}
          onClick={this.onGoBack}
        >
          <img src={svg.back_arrow_inactive_icon}/>
        </button>
        <button
          disabled={isButtonDisabled}
          onClick={this.onGoForward}
        >
          <img src={svg.foward_arrow_inactive_icon}/>
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
