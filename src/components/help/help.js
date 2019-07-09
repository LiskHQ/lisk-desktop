import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../boxV2';
import { PrimaryButtonV2 as Button } from './../toolbox/buttons/button';
import styles from './help.css';
import links from './../../constants/externalLinks';
import Piwik from '../../utils/piwik';
import Illustration from '../toolbox/illustration';
import Icon from '../toolbox/icon';

/* eslint-disable class-methods-use-this */
class Help extends React.Component {
  visitHelpCenter() {
    const win = window.open(links.helpCenter, '_blank');
    win.focus();
  }
  /* istanbul ignore next */
  checkTermsAndConditions() { /* istanbul ignore next */
    Piwik.trackingEvent('Help', 'button', 'Terms and Conditions');
  }

  render() { /* istanbul ignore next */
    const ArrowIcon = () => <Icon name='helpCenterArrow' className={styles.listArrow} />;
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
            <Illustration name='helpCenter' />
          </section>
        </section>
        <section className={`${grid.row} ${styles.helpSection} help-articles`}>
          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <Icon name='helpCenter' className={styles.titleIcon} />
              {this.props.t('Help Center')}
            </h4>
            <section className={grid.row}>
              <p className={`${grid['col-sm-6']} ${grid['col-md-12']}`}>
                {this.props.t('Perhaps your question has already been raised in our FAQ')}
              </p>
              <Button className='help-visit-center' onClick={() => this.visitHelpCenter() }>
                {this.props.t('Visit Help Center')}
              </Button>
            </section>
          </article>
          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <Icon name='academy' className={styles.titleIcon} />
              {this.props.t('Academy')}
            </h4>
            <section className={grid.row}>
              <p className={`${grid['col-sm-6']} ${grid['col-md-12']}`}>
                {this.props.t('Learn about blockchain with our comprehensive knowledge base.')}
              </p>
              <div className={grid['col-sm-6']}>
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
            </section>
          </article>
          <article className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.articleContainer}`}>
            <h4>
              <Icon name='liskChat' className={styles.titleIcon} />
              {this.props.t('Lisk.Chat')}
            </h4>
            <section className={grid.row}>
              <p className={`${grid['col-sm-6']} ${grid['col-md-12']}`}>
                {this.props.t('Don’t be a stranger! Connect with our worldwide community.')}
              </p>
              <div className={grid['col-sm-6']}>
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
            </section>
          </article>
        </section>
      </Box>
    );
  }
}

export default Help;
