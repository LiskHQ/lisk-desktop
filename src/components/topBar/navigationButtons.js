import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './navigationButtons.css';

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialPage: 0,
      currentPage: 0,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
  }

  componentDidMount() {
    this.setState({
      initialPage: this.props.history.length,
      currentPage: this.props.history.length,
    });
  }

  onGoBack() {
    const { initialPage, currentPage } = this.state;
    const { history } = this.props;

    if (history.length > initialPage && currentPage > initialPage) {
      this.setState({ ...this.state, currentPage: this.state.currentPage - 1 });
      this.props.history.goBack();
    }
  }

  onGoForward() {
    const { initialPage, currentPage } = this.state;
    const { history } = this.props;

    if (history.length >= initialPage && currentPage <= history.length) {
      this.setState({ ...this.state, currentPage: this.state.currentPage + 1 });
      this.props.history.goForward();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className={styles.wrapper}>
        <button onClick={this.onGoBack}><img src={svg.back_arrow_inactive_icon}/></button>
        <button onClick={this.onGoForward}><img src={svg.foward_arrow_inactive_icon}/></button>
      </div>
    );
  }
}

export default NavigationButtons;
