import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './navigationButtons.css';

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initPathChecker: 0,
      currentPage: 0,
      isUserLogedIn: false,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      initPathChecker: this.props.history.length,
      isUserLogedIn: this.props.account.address || false,
    }));
  }

  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) {
      this.setState(prevState => ({
        ...prevState,
        isUserLogedIn: this.props.account.address || false,
      }));
      return true;
    }

    return false;
  }

  onGoBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  onGoForward(e) {
    e.preventDefault();
    this.props.history.goForward();
  }

  render() {
    const { isUserLogedIn } = this.state;

    return (
      <div className={styles.wrapper}>
        <button
          disabled={isUserLogedIn}
          onClick={this.onGoBack}
        >
          <img src={svg.back_arrow_inactive_icon}/>
        </button>
        <button
          disabled={isUserLogedIn}
          onClick={this.onGoForward}
        >
          <img src={svg.foward_arrow_inactive_icon}/>
        </button>
      </div>
    );
  }
}

export default NavigationButtons;
