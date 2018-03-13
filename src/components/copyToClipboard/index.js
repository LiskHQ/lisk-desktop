import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import styles from './copyToClipboard.css';

class CopyToClipboard extends React.Component {
  constructor() {
    super();
    this.state = {
      copied: false,
    };
  }

  textIsCopied() {
    this.setState({
      copied: true,
    });
    setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 3000);
  }

  render() {
    const { value, t, className, text, copyClassName } = this.props;
    return (
      <ReactCopyToClipboard text={value} onCopy={() => this.textIsCopied()}>
        {this.state.copied ? <span className={`${className} copied`}>
          {t('Copied!')} <FontIcon value='copy-to-clipboard' className={copyClassName}></FontIcon>
        </span> :
          <span className={`${className} ${styles.clickable} default`}>
            <span className='copy-title'>{text || value}</span>
            <FontIcon value='copy-to-clipboard' className={copyClassName}></FontIcon>
          </span>
        }
      </ReactCopyToClipboard>
    );
  }
}

export default (translate()(CopyToClipboard));
