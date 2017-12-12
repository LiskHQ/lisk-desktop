import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from './../../assets/images/icons/copy.svg';

class CopyToClipboard extends React.Component {
  render() {
    return (
      <ReactCopyToClipboard text={this.props.value} >
        <span className={this.props.className}>
          <img src={copyIcon} />&nbsp;
          <span className='copy-title'>{this.props.text ? this.props.text : this.props.value}</span>
        </span>
      </ReactCopyToClipboard>
    );
  }
}

export default CopyToClipboard;
