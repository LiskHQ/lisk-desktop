import React from 'react';
import ReactSwipe from 'react-swipe';
import styles from './setting.css';
import SliderCheckbox from '../toolbox/checkbox';
import RelativeLink from '../relativeLink';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      activeSlide: 0,
    };
  }

  changeSlide(i) {
    this.setState({
      activeSlide: i,
    });
  }

  render() {
    const { t } = this.props;
    return <footer>
      <ReactSwipe
        className={styles.carousel}
        ref={(reactSwipe) => { this.reactSwipe = reactSwipe; }}
        swipeOptions={{
          stopPropagation: true,
          continuous: false,
          transitionEnd: index => this.changeSlide(index),
        }}>
        <div>
          <SliderCheckbox
            theme={styles}
            className={`${styles.smallSlider}`}
            onChange={e => console.log(e.checked)}
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
          <SliderCheckbox
            theme={styles}
            className={`${styles.smallSlider}`}
            onChange={e => console.log(e.checked)}
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
          <RelativeLink
            className={`register-second-passphrase ${styles.secondPassphrase}`}
            to='register-second-passphrase'>
            {t('Add')}
          </RelativeLink>
          <article>
            <h5>{t('Security')}</h5>
            <p>{t('Register 2nd passphrase')}</p>
          </article>
        </div>
      </ReactSwipe>
      <ul className={ styles.carouselNav }>
        {[...Array(3)].map((x, i) =>
          <li
            key={i}
            className={(i === this.state.activeSlide) ? styles.activeSlide : ''}
            onClick={() => this.reactSwipe.slide(i)}>
          </li>,
        )}
      </ul>
    </footer>;
  }
}

export default Setting;
