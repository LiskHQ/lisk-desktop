import React from 'react';
import { Button } from '../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import CopyToClipboard from '../copyToClipboard';

import styles from './resultBox.css';
import check from '../../assets/images/icons/check.svg';

class ResultBox extends React.Component {
  render() {
    return (
      <div className={`${styles.resultBox} boxPadding`}>
        <div className={styles.header}>
          {this.props.success
            ? <img src={check} className={styles.icon}/>
            : <FontIcon value='error' className={styles.icon}/>
          }
        </div>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <p className='result-box-message'>
          {this.props.body}
        </p>

        {this.props.copy ?
          <CopyToClipboard value={this.props.copy.value}
            text={this.props.copy.title}
            className={`${styles.copy}`} /> :
          null
        }

        <footer>
          <Button className={`okay-button ${styles.okButton}`}
            onClick={() => { this.props.finalCallback(); this.props.reset(); } }>
            {this.props.t('Okay')}
          </Button>
          <div className='subTitle'>{this.props.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default ResultBox;
