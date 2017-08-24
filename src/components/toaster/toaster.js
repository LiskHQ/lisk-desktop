import React, { Component } from 'react';
import { Snackbar } from 'react-toolbox';
import styles from './toaster.css';

class Toaster extends Component {
  constructor() {
    super();
    this.state = {
      hidden: {},
    };
  }

  hideToast(toast) {
    setTimeout(() => {
      this.props.hideToast(toast);
      this.setState({ hidden: { ...this.state.hidden, [toast.index]: false } });
    }, 500);
    this.setState({ hidden: { ...this.state.hidden, [toast.index]: true } });
  }

  render() {
    return (<span>
      {this.props.toasts.map(toast => (
        <Snackbar
          active={!!toast.label && !this.state.hidden[toast.index]}
          key={toast.index}
          label={toast.label}
          timeout={4000}
          className={`${styles.toast} ${styles[toast.type]} ${styles[`index-${toast.index}`]}`}
          onTimeout={this.hideToast.bind(this, toast)}
        />
      ))}
    </span>);
  }
}

export default Toaster;
