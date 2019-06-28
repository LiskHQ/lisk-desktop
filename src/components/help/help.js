import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../boxV2';
import { PrimaryButtonV2 as Button } from './../toolbox/buttons/button';
import styles from './help.css';
import links from './../../constants/externalLinks';
import Piwik from '../../utils/piwik';
import academyIcon from '../../assets/images/help/academy.svg';
import helpCenterIcon from '../../assets/images/help/help-center.svg';
import liskChatIcon from '../../assets/images/help/lisk-chat.svg';
import Illustration from '../../assets/images/help/Illustration.svg';
import arrowIcon from '../../assets/images/help/arrow.svg';

/* eslint-disable class-methods-use-this */
class Help extends React.Component {
  visitHelpCenter() {
    const win = window.open(links.helpCenter, '_blank');
    win.focus();
  }

  checkTermsAndConditions() {
    Piwik.trackingEvent('Help', 'button', 'Terms and Conditions');
  }

  render() {
    const ArrowIcon = () => <img src={arrowIcon} className={styles.listArrow} />;
    return (
      <Box className={styles.wrapper}>
        <header>
          <h2>{this.props.t('Help Center')}</h2>
        </header>
        <section className={`${grid.row} ${styles.topRow}`}>
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.topBox}`}>
            <article>
              <h3>{this.props.t('Don’t worry, we’re here to help')}</h3>
              <p>
                {this.props.t('Browse through our tutorials, check out the FAQ section, connect with our community or take a look at our ')}
                <a
                  onClick={this.checkTermsAndConditions}
                  href={'https://lisk.io/terms-conditions'}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.props.t('Terms of Use')}
                </a>
              </p>
            </article>
            <img src={Illustration} />
          </section>
        </section>

        <section className={`${grid.row} ${styles.helpSection} help-articles`}>
          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <img src={helpCenterIcon} className={styles.titleIcon} />
              {this.props.t('Help Center')}
            </h4>
            <p className={styles.faqWrapper}>
              {this.props.t('Perhaps your question has already been raised in our FAQ')}
            </p>
            <Button className='help-visit-center' onClick={() => this.visitHelpCenter() }>
              {this.props.t('Visit Help Center')}
            </Button>
          </article>

          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <img src={academyIcon} className={styles.titleIcon} />
              {this.props.t('Academy')}
            </h4>
              <p>{this.props.t('Learn about blockchain with our comprehensive knowledge base.')}
              </p>
              <div>
                <ul>
                  <li>
                    <a target='_blank' href={links.explainBlockchain} rel='noopener noreferrer'>
                      {this.props.t('Explain Blockchain Like I\'m 5')}
                      <ArrowIcon />
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.isBlockchainSecure} rel='noopener noreferrer'>
                      {this.props.t('Is Blockchain Secure?')}
                      <ArrowIcon />
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.seeMore} rel='noopener noreferrer'>
                      {this.props.t('See more')}
                      <ArrowIcon />
                    </a>
                  </li>
                </ul>
              </div>
          </article>

          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <img src={liskChatIcon} className={styles.titleIcon} />
              {this.props.t('Lisk.Chat')}
            </h4>
              <div>
                <p>{this.props.t('Don’t be a stranger! Connect with our worldwide community.')}
                </p>
              </div>
              <div>
                <ul>
                  <li>
                    <a target='_blank' href={links.liskChat} rel='noopener noreferrer'>
                      {this.props.t('Visit Lisk.Chat')}
                      <ArrowIcon />
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.helpDeskChannel} rel='noopener noreferrer'>
                      {this.props.t('See #help-desk channel')}
                      <ArrowIcon />
                    </a>
                  </li>
                </ul>
              </div>
          </article>
        </section>
      </Box>
    );
  }
}

export default Help;
