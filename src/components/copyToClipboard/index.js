import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { FontIcon } from '../fontIcon';
import styles from './copy.css';

class CopyToClipboard extends React.Component {
  render() {
    return (
      <ReactCopyToClipboard text={this.props.value} >
        <span className={`${this.props.className} ${styles.clickable}`}>
          <span className='copy-title'>{this.props.text ? this.props.text : this.props.value}</span>
          <FontIcon value='copy-to-clipboard' className={this.props.copyClassName}></FontIcon>&nbsp;
        </span>
      </ReactCopyToClipboard>
    );
  }
}

export default CopyToClipboard;
