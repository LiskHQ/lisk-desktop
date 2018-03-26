import React from 'react';
import { Link } from 'react-router-dom';
import ReactSwipe from 'react-swipe';
import styles from './setting.css';
import Checkbox from '../toolbox/sliderCheckbox';
import i18n from '../../i18n';
import accountConfig from '../../constants/account';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
// TODO: will be re-enabled when the functionality is updated
// import languageSwitcherTheme from './languageSwitcher.css';

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

  // changeLanguage(e) {//eslint-disable-line
  //   if (e.checked) {
  //     i18n.changeLanguage('de');
  //   } else {
  //     i18n.changeLanguage('en');
  //   }
  // }

  toggleAutoLog(state) {
    const { account, settings, settingsUpdated, accountUpdated } = this.props;
    if (state && account.passphrase) {
      const date = Date.now() + accountConfig.lockDuration;
      accountUpdated({ expireTime: date });
    }
    settingsUpdated({ autoLog: !settings.autoLog });
  }

  render() {
    this.language = (i18n.language === 'de');
    const showSetting = this.props.showSetting ? styles.active : '';
    const { t, settings, settingsUpdated, hasSecondPassphrase } = this.props;
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
            className={`${styles.smallSlider} advancedMode`}
            onChange={() => settingsUpdated({ advancedMode: !settings.advancedMode })}
            input={{
              value: true,
              checked: settings.advancedMode,
            }}/>
          <article>
            <h5>{t('Delegate features')}</h5>
            <p>{t('Delegate section will be displayed.')}</p>
          </article>
        </div>
        <div>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider} autoLog`}
            onChange={() => this.toggleAutoLog(!settings.autoLog)}
            input={{
              value: true,
              checked: settings.autoLog,
            }}/>
          <article>
            <h5>{t('Auto-Lock')}</h5>
            <p>{t('Lock ID’s automatically after 10 minutes.')}</p>
          </article>
        </div>
        <div>
          {!hasSecondPassphrase ?
            <Link
              className={`register-second-passphrase ${styles.secondPassphrase}`}
              to={`${routes.main.path}${routes.secondPassphrase.path}`}>
              {t('Add')}
            </Link> :
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
        {/* TODO: will be re-enabled when the functionality is updated
        <div>
          <Checkbox
            theme={languageSwitcherTheme}
            className={`${styles.smallSlider} language-switcher`}
            onChange={this.changeLanguage.bind(this)}
            textAsIcon={true}
            icons={{
              unchecked: 'EN',
              checked: 'DE',
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
        */}
      </ReactSwipe>
      <ul className={ styles.carouselNav } id='carouselNav'>
        {[...Array(3)].map((x, i) =>
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
