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
          <FontIcon value='copy-to-clipboard' className={copyClassName}></FontIcon> {t('Copied!')}
        </span> :
          <span className={`${className} ${styles.clickable} default`}>
            <FontIcon value='copy-to-clipboard' className={copyClassName}></FontIcon>
            <span className='copy-title'>{text || value}</span>
          </span>
        }
      </ReactCopyToClipboard>
    );
  }
}

export default (translate()(CopyToClipboard));
