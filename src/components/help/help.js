import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../box';
import { FontIcon } from '../fontIcon';
import { Button } from './../toolbox/buttons/button';
import styles from './help.css';

/* eslint-disable class-methods-use-this */
class Help extends React.Component {
  initOnboarding() {

  }

  visitHelpCenter() {

  }

  render() {
    const fAQIcon = () => (<span className={styles.inlineIcon}><FontIcon>info</FontIcon>{this.props.t(' FAQ')}</span>);
    const chatIcon = () => (<span className={styles.inlineIcon}><FontIcon>remove</FontIcon>{this.props.t(' Chat')}</span>);
    return (
      <Box className={styles.wrapper}>
        <aside className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.helpSection} ${styles.sideBar}`}>
          <h2>{this.props.t('Help')}</h2>
          <p>{this.props.t('Search through our tutorials, FAQs or connect to our community all over the world.')}</p>
          <a onClick={() => this.initOnboarding() }>{this.props.t('New to Hub? Take a tour')}
            <FontIcon>arrow-right</FontIcon>
          </a>
        </aside>

        <section className={`${grid['col-sm-12']} ${grid['col-md-8']} ${styles.helpSection}`}>
          <article>
            <h2>
              <FontIcon className={styles.headerIcon}>remove</FontIcon>
              {this.props.t('Help Center')}
            </h2>
            <div className={styles.articleContainer}>
              <div>
                <p>{this.props.t('Search for advice and answers in our extensive ')}
                  {fAQIcon()}
                  {this.props.t(' or get in touch in the ')}
                  {chatIcon()}
                </p>
              </div>
              <div>
              <Button onClick={() => this.visitHelpCenter() }>{this.props.t('Visit Help Center')}
                <FontIcon>arrow-right</FontIcon>
              </Button>
              </div>
            </div>
          </article>

          <article>
            <h2>
              <FontIcon className={styles.headerIcon}>remove</FontIcon>
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
                    <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
                      {this.props.t('Explain Blockchain Like I\'m 5')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
                      {this.props.t('Is Blockchain Secure?')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
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
              <FontIcon className={styles.headerIcon}>remove</FontIcon>
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
                    <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
                      {this.props.t('Visit Lisk.Chat')}
                      <FontIcon>arrow-right</FontIcon>
                    </a>
                  </li>
                  <li>
                    <a target='_blank' href='http://help.lisk.io/faq#sidechains' rel='noopener noreferrer'>
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
