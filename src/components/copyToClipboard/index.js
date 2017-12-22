import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { FontIcon } from '../fontIcon';

class CopyToClipboard extends React.Component {
  render() {
    return (
      <ReactCopyToClipboard text={this.props.value} >
        <span className={this.props.className}>
          <FontIcon value='copy-to-clipboard'></FontIcon>&nbsp;
          <span className='copy-title'>{this.props.text ? this.props.text : this.props.value}</span>
        </span>
      </ReactCopyToClipboard>
    );
  }
}

export default CopyToClipboard;
