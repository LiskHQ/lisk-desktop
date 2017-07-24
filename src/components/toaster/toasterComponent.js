import React, { Component } from 'react';
import { Snackbar } from 'react-toolbox';
import styles from './toaster.css';

class ToasterComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }

  hideToast() {
    setTimeout(() => {
      this.props.hideToast();
      this.setState({ hidden: false });
    }, 500);
    this.setState({ hidden: true });
  }

  render() {
    return (<Snackbar
      active={!!this.props.label && !this.state.hidden}
      label={this.props.label}
      timeout={4000}
      className={`${styles.toast} ${styles[this.props.type]}`}
      onTimeout={this.hideToast.bind(this)}
    />);
  }
}

export default ToasterComponent;
