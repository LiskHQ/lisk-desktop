import React from 'react';
import { Button } from '../toolbox/buttons/button';
import styles from './resultBox.css';
import copy from '../../assets/images/icons/copy.svg';
import check from '../../assets/images/icons/check.svg';

class ResultBox extends React.Component {
  showCopyElement() {
    if (this.props.copy) {
      return <div onClick={this.props.copyToClipboard.bind(this, this.props.copy.value)}
        className={`${styles.copy}`}>
        <img src={copy}/> <span className='copy-title'>{this.props.copy.title}</span>
      </div>;
    }
    return null;
  }

  render() {
    return (
      <div className={`${styles.resultBox} boxPadding`}>
        <div className={styles.header}>
          {this.props.success
            ? <img src={check} className={styles.icon}/>
            : <i className={`${styles.icon} material-icons`}>clear</i>
          }
        </div>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <p className='result-box-message'>
          {this.props.body}
        </p>

        {this.showCopyElement()}

        <footer>
          <Button className='okay-button' onClick={() => { this.props.callback(); } }>{this.props.t('Okay')}</Button>
          <div className='subTitle'>{this.props.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default ResultBox;
