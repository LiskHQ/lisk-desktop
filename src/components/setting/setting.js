import React from 'react';
import ReactSwipe from 'react-swipe';
import styles from './setting.css';
import languageSwitcherTheme from './languageSwitcher.css';
import Checkbox from '../toolbox/checkbox';
import RelativeLink from '../relativeLink';
import i18n from '../../i18n';
import { FontIcon } from '../fontIcon';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      activeSlide: 0,
    };
  }

  changeSlide(i) {
    this.reactSwipe.slide(i);
    this.setState({
      activeSlide: i,
    });
  }

  changeLanguage(e) {//eslint-disable-line
    if (e.checked) {
      i18n.changeLanguage('de');
    } else {
      i18n.changeLanguage('en');
    }
  }

  render() {
    this.language = (i18n.language === 'de');
    const showSetting = this.props.showSetting ? styles.active : '';
    const { t, hasSecondPassphrase } = this.props;
    return <footer className={`${styles.wrapper} ${showSetting}`}>
      <ReactSwipe
        className={styles.carousel}
        ref={(reactSwipe) => { this.reactSwipe = reactSwipe; }}
        swipeOptions={{
          stopPropagation: true,
          continuous: false,
          transitionEnd: index => this.changeSlide(index),
        }}>
        <div>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider}`}
            clickable={true}
            input={{
              value: true,
              checked: true,
            }}/>
          <article>
            <h5>{t('Auto-Lock')}</h5>
            <p>{t('Lock ID’s automatically after 10 minutes.')}</p>
          </article>
        </div>
        <div>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider}`}
            clickable={true}
            input={{
              value: true,
            }}/>
          <article>
            <h5>{t('Advanced features')}</h5>
            <p>{t('Delegate section will be displayed.')}</p>
          </article>
        </div>
        <div>
          <Checkbox
            theme={languageSwitcherTheme}
            className={`${styles.smallSlider} language-switcher`}
            onChange={this.changeLanguage.bind(this)}
            clickable={true}
            textAsIcon={true}
            icons={{
              start: 'EN',
              done: 'DE',
              goal: 'DE',
              begin: 'EN',
            }}
            input={{
              value: 'true',
              checked: this.language,
            }}/>
          <article>
            <h5>{t('Language')}</h5>
            <p>{t('Currently we speaking english and german.')}</p>
          </article>
        </div>
        <div>
          {!hasSecondPassphrase ?
            <RelativeLink
              className={`register-second-passphrase ${styles.secondPassphrase}`}
              to='register-second-passphrase'>
              {t('Add')}
            </RelativeLink> :
            <span
              className={`register-second-passphrase ${styles.secondPassphraseEnabled}`}>
              <FontIcon>checkmark</FontIcon>
            </span>
          }
          <article>
            <h5>{t('Security')}</h5>
            <p>{t('Register 2nd passphrase')}</p>
          </article>
        </div>
      </ReactSwipe>
      <ul className={ styles.carouselNav } id='carouselNav'>
        {[...Array(4)].map((x, i) =>
          <li
            key={i}
            className={(i === this.state.activeSlide) ? styles.activeSlide : ''}
            onClick={this.changeSlide.bind(this, i)}>
          </li>,
        )}
      </ul>
    </footer>;
  }
}

export default Setting;
