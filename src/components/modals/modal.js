import React from 'react';
import { Button } from '../toolbox/buttons/button';
import styles from './modal.css';
import copy from '../../assets/images/icons/copy.svg';

class Modal extends React.Component {
  showCopyElement() {
    if (this.props.data.copy) {
      return <div onClick={this.props.copyToClipboard.bind(this, this.props.data.copy.value)}
        className={`${styles.copy}`}>
        <img src={copy}/> <span>{this.props.data.copy.title}</span>
      </div>;
    }
    return null;
  }

  render() {
    return (
      <div className={`${styles.modal} boxPadding`}>
        <div className={styles.header}>
          {this.props.data.success
            ? <i className={`${styles.temporarySuccessCheck} material-icons`}>check</i>
            : <i className={`${styles.temporarySuccessCheck} material-icons`}>clear</i>
          }
        </div>
        <header>
          <h2>{this.props.data.title}</h2>
        </header>
        <p className='modal-message'>
          {this.props.data.body}
        </p>

        {this.showCopyElement()}

        <footer>
          <Button className='okay-button' onClick={() => { this.props.data.callback(); } }>{this.props.t('Okay')}</Button>
          <div className='subTitle'>{this.props.data.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default Modal;
