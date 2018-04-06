import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import styles from './sidechains.css';
import application from './../../assets/images/sidechains/graphic-application.svg';
import bootstrap from './../../assets/images/sidechains/graphic-bootstrap.svg';
import hosts from './../../assets/images/sidechains/graphic-hosts.svg';
import register from './../../assets/images/sidechains/graphic-register.svg';

class Sidechains extends React.Component {
  render() {
    const { t } = this.props;
    return (<Box className={styles.wrapper}>
      <div className={styles.bigGraphic}>
        <img src={application} className={styles.application}/>
        <img src={hosts} className={styles.hosts}/>
        <img src={register} className={styles.register}/>
        <img src={bootstrap} className={styles.bootstrap}/>
      </div>
      <div className={styles.header}>
        <h2>{t('Coming soon.')}</h2>
        <div className={styles.subHeader}>
          {t('Sidechains will revolutionize the way decentralised apps are developed. Here you will be able to find hosts, and monitor your sidechains soon.')}
        </div>
        <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
          {t('Learn more about Lisk sidechains')}&nbsp;<FontIcon>arrow-right</FontIcon>
        </a>
        <img src={application} className={styles.smallGraphic}/>
      </div>
    </Box>);
  }
}

export default withRouter(translate()(Sidechains));

