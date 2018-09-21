import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../box';
import { FontIcon } from '../fontIcon';
import { Button } from './../toolbox/buttons/button';
import styles from './help.css';
import links from './../../constants/help';

/* eslint-disable class-methods-use-this */
class Help extends React.Component {
  initOnboarding() {
    this.props.settingsUpdated({ onBoarding: true });
  }

  visitHelpCenter() {
    const win = window.open(links.helpCenter, '_blank');
    win.focus();
  }

  render() {
    const fAQIcon = () => (<span className={styles.inlineIcon}><FontIcon>info</FontIcon><b>{this.props.t(' FAQ')}</b></span>);
    const chatIcon = () => (<span className={styles.inlineIcon}><FontIcon>conversation</FontIcon><b>{this.props.t(' Chat')}</b></span>);
    return (
      <Box className={styles.wrapper}>
        <aside className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.sideBar}`}>
          <header>
            <h2>{this.props.t('Help')}</h2>
            <p>{this.props.t('Search through our tutorials, FAQs or connect to our community all over the world.')}</p>
            {
              this.props.account.address ?
                <a className='help-onboarding' onClick={() => this.initOnboarding() }>{this.props.t('New to Hub? Take a tour')}
                <FontIcon>arrow-right</FontIcon>
              </a> : null
            }
          </header>
        </aside>

        <section className={`${grid['col-sm-12']} ${grid['col-md-8']} ${styles.helpSection} help-articles`}>
          <article>
            <h2>
              <FontIcon className={styles.headerIcon}>logo-icon</FontIcon>
              {this.props.t('Help Center')}
            </h2>
            <div className={styles.articleContainer}>
              <div>
                <p>{this.props.t('Search for advice and answers in our extensive ')}
                  {fAQIcon()}
                  {this.props.t(' or get in touch in the ')}
                  {chatIcon()}.
                </p>
              </div>
              <div>
              <Button className='help-visit-center' onClick={() => this.visitHelpCenter() }>{this.props.t('Visit Help Center')}
                <FontIcon>arrow-right</FontIcon>
              </Button>
              </div>
            </div>
          </article>

          <article>
            <h2>
              <FontIcon className={styles.headerIcon}>academy</FontIcon>
              {this.props.t('Academy')}
            </h2>
            <div className={styles.articleContainer}>
              <div>
                <p>{this.props.t('The Lisk Academy aims to make learning about blockchain technology interactive and enjoyable.')}
                </p>
              </div>
              <div>
                <ul>
                  <li>
                    <a target='_blank' href={links.explainBlockchain} rel='noopener noreferrer'>
                      {this.props.t('Explain Blockchain Like I\'m 5')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.isBlockchainSecure} rel='noopener noreferrer'>
                      {this.props.t('Is Blockchain Secure?')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.seeMore} rel='noopener noreferrer'>
                      {this.props.t('See more')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article>
            <h2>
              <FontIcon className={styles.headerIcon}>lisk-chat</FontIcon>
              {this.props.t('Lisk.Chat')}
            </h2>
            <div className={styles.articleContainer}>
              <div>
                <p>{this.props.t('Don’t be a stranger! Connect to our community all over the world.')}
                </p>
              </div>
              <div>
                <ul>
                  <li>
                    <a target='_blank' href={links.liskChat} rel='noopener noreferrer'>
                      {this.props.t('Visit Lisk.Chat')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href={links.helpDeskChannel} rel='noopener noreferrer'>
                      {this.props.t('See #help-desk channel')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </Box>
    );
  }
}

export default Help;
