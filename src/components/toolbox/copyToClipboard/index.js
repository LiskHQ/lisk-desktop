import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import Icon from '../icon';
import styles from './copyToClipboard.css';
import Piwik from '../../../utils/piwik';

class CopyToClipboard extends React.Component {
  constructor() {
    super();
    this.state = {
      copied: false,
    };
    this.textIsCopied = this.textIsCopied.bind(this);
  }

  textIsCopied() {
    Piwik.trackingEvent('CopyToClipboard', 'button', 'Copy');
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
    const {
      value, t, className, text, copyClassName,
    } = this.props;
    return (
      <div onClick={(e) => {
        e.stopPropagation();
      }}>
        <ReactCopyToClipboard text={value} onCopy={this.textIsCopied}>
          {this.state.copied ? <span className={`${className} copied`}>
            {t('Copied!')}
          </span> :
            <span className={`${className} ${styles.clickable} default`}>
              <span className='copy-title'>{text || value} </span>
              <Icon name='copy' className={copyClassName}/>
            </span>
          }
        </ReactCopyToClipboard>
      </div>
    );
  }
}

CopyToClipboard.defaultProps = {
  className: '',
  copyClassName: '',
};

export default (translate()(CopyToClipboard));
