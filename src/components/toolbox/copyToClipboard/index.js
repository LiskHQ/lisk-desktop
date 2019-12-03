import React from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { withTranslation } from 'react-i18next';
import Icon from '../icon';
import styles from './copyToClipboard.css';
import Piwik from '../../../utils/piwik';

const IconAndText = ({
  value, t, className, text, copyClassName, Container, containerProps, onCopy, copied,
}) => (
  <ReactCopyToClipboard text={value} onCopy={onCopy}>
    <Container disabled={copied} {...containerProps}>
      {copied ? (
        <span className={`${className} copied`}>
          {t('Copied!')}
        </span>
      ) : (
        <span className={`${className} ${styles.clickable} default`}>
          <span className="copy-title">
            {text || value}
          </span>
          {' '}
          <Icon name="copy" className={`${styles.icon} ${copyClassName}`} />
        </span>
      )}
    </Container>
  </ReactCopyToClipboard>
);

const IconOnly = ({
  copyClassName,
  value,
  onCopy,
  copied,
}) => (
  <ReactCopyToClipboard text={value} onCopy={onCopy}>
    <Icon name={copied ? 'transactionApproved' : 'copy'} className={`${styles.icon} ${copyClassName}`} />
  </ReactCopyToClipboard>
);

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
    this.timeout = setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { copied } = this.state;
    const { onClick, type } = this.props;
    return (
      <div onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      >
        {
          type === 'icon'
            ? <IconOnly {...this.props} copied={copied} onCopy={this.textIsCopied} />
            : <IconAndText {...this.props} copied={copied} onCopy={this.textIsCopied} />
        }
      </div>
    );
  }
}

const DefaultContainer = ({ children, onClick }) => <span onClick={onClick}>{children}</span>;

CopyToClipboard.defaultProps = {
  className: '',
  copyClassName: '',
  Container: DefaultContainer,
  containerProps: {},
};

export default (withTranslation()(CopyToClipboard));
